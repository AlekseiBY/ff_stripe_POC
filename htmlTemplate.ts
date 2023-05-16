export const getHtmlTemplate = (clientSecret: string, customerId: string) => {
    return `<!DOCTYPE html>
    <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Checkout</title>
            <script type="module">
                import { loadStripe } from 'https://cdn.skypack.dev/@stripe/stripe-js';

                (async () => {
                    const stripe = await loadStripe('pk_test_51MeXRsEWRVPH3ShUVU6gk4IQByWX6r4DSAtQhyldYVEGAHuSEpd0Pge1LwG2Mremls37lm4oJE78Hv1Tt6rltUdY002v4Bwmlp');

                    const loader = 'auto';

                    const elements = stripe.elements({clientSecret: "${clientSecret}", loader});

                    const linkAuthenticationElement = elements.create("linkAuthentication");
                    const paymentElement = elements.create('payment', {
                        defaultValues: {
                            billingDetails: {
                                name: 'John Doe',
                                phone: '888-888-8888',
                            },
                        },
                    });

                    linkAuthenticationElement.mount("#link-authentication-element");
                    paymentElement.mount("#payment-element");

                    const form = document.getElementById('payment-form');

                    form.addEventListener('submit', async (event) => {
                        event.preventDefault();

                        const {error} = await stripe.confirmSetup({
                            elements,
                            confirmParams: {
                                return_url: "http://localhost:3008/opendDoor?customerId=${customerId}",
                            }
                        });

                        if (error) {
                            // Show error to your customer (for example, payment details incomplete)
                            console.log(error.message);
                        } 
                    });
                })()
            </script>
        </head>
        <body>
            <div style="width: 400px; height: 600px;">
                <form id="payment-form" data-secret="${clientSecret}">
                    <h3>Contact info</h3>
                    <div id="link-authentication-element"></div>
                    
                    <h3>Payment</h3>
                    <div id="payment-element"></div>
                    
                    <button id="submit">Submit</button>
                </form>
            </div>
        </body>
    </html>`;
};

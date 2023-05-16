import { loadStripe } from 'https://cdn.skypack.dev/@stripe/stripe-js';

(async () => {
    const stripe = await loadStripe('sk_test_51MeXRsEWRVPH3ShULNDBrwIPUze8qjg1yEuNgvwbT8Yo6C33WAs2ZoSQ6TnZUvaCN4z1okQyJztWVzl9c1EWSGOR00nDC5SGua');

    const loader = 'auto';

    const elements = stripe.elements({clientSecret, loader});

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
})()
import Stripe from 'stripe';

export class StripeService {
    private stripe = new Stripe('sk_test_51MeXRsEWRVPH3ShULNDBrwIPUze8qjg1yEuNgvwbT8Yo6C33WAs2ZoSQ6TnZUvaCN4z1okQyJztWVzl9c1EWSGOR00nDC5SGua', {apiVersion: '2022-11-15'});
    // private customer: Stripe.Customer | null = null;
    private setupIntent: Stripe.SetupIntent | null = null;

    async createSetupIntent() {
        const customer = await this.stripe.customers.create();
    
        this.setupIntent = await this.stripe.setupIntents.create({
            customer: customer.id,
            payment_method_types: ['card', 'link'],
        });
    
        return [this.setupIntent, customer];
    }

    async charge(customer: string) {
        if(this.setupIntent) {
            
            try {
                const paymentMethods = await this.stripe.paymentMethods.list({
                    customer,
                    // type: 'link',
                });

                await this.preauthReq(paymentMethods.data[0], customer);

                setTimeout(() => this.paymentReq(paymentMethods.data[0], customer), 50000);
                console.log('done');
            } catch (err) {
                console.log('Error ', err);
            }
            // this.customer = null;
            // this.setupIntent = null;
        }
    }

    private async preauthReq(paymentMethod: Stripe.PaymentMethod, customerId: string) {

        this.stripe.customers.list({})

        if(this.setupIntent) {

            const paymentIntent = await this.stripe.paymentIntents.create({
                amount: 1000,
                currency: 'eur',
                customer: customerId,
                payment_method: paymentMethod.id,
                capture_method: 'manual',
            });

            await this.stripe.paymentIntents.cancel(paymentIntent.id);
        }
    }
    
    private async paymentReq(paymentMethod: Stripe.PaymentMethod, customerId: string) {
        if(this.setupIntent) {
            try {
                await this.stripe.paymentIntents.create({
                    amount: 1500,
                    currency: 'eur',
                    customer: customerId,
                    payment_method: paymentMethod.id,
                    off_session: true,
                    confirm: true,
                });
                console.log('done 2')  
            } catch (error) {
                console.log(error);
            }
        }
    }
}

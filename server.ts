import express from 'express';
// import { engine } from 'express-handlebars';
import { getHtmlTemplate } from './htmlTemplate';
import { StripeService } from './stripe';
const port = 3008;

export const createServer = () => {
    const stripeService = new StripeService(); 
    const app = express();
    
    // app.engine('.hbs', engine({ extname: '.hbs' }));
    // app.set('view engine', '.hbs');
    // app.set('views', './views');
    
    // app.get('/', async (req, res) => {
    //   const intent = await createSetupIntent();
    //   res.render('checkout', { client_secret: intent.client_secret });
    // });

    app.get('/', async (req, res) => {
      const [intent, customer] = await stripeService.createSetupIntent();
      //@ts-ignore
      const clientSecret = intent.client_secret;
      console.log('clientSecret ', clientSecret);
      res.send(getHtmlTemplate(clientSecret, customer.id));
    });

    app.get('/opendDoor',async (req, res) => {
      console.log('req.query', req.query);
      const {
        customerId,
        setup_intent,
        setup_intent_client_secret,
        redirect_status,
      } = req.query;
        // setup_intent seti_1MoiOUEWRVPH3ShUkPrzJhcl
        // setup_intent_client_secret seti_1MoiOUEWRVPH3ShUkPrzJhcl_secret_NZs8Pcx4QJ9r9io9rOPFMYl5TzIGoJW
      await stripeService.charge(customerId as string);
      res.send(`
          <html><div>Open fridge</div></html>
      `);
    });
    app.listen(port, () => {
      console.log(`http://localhost:${port}`);
    });
}

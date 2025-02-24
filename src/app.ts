import express, { Application, Request, Response } from 'express'

import modules from './modules';
import path from 'path';
import Parcel from './models/parcel';
import { NotFoundException } from './utils/service-exception';
import bodyParser from 'body-parser';
import cookieParser from "cookie-parser";

const app: Application = express();
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.json())
app.use(modules);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '../views'));
// Serve static files from the public directory
app.use(express.static(path.join(__dirname, '../public')));


const requireLogin = (req, res, next) => {
    const authCookie = req.cookies.auth;
    if (authCookie) {
        // User is logged in
        next();
    } else {
        // User is not logged in, redirect to login page or show an error message
        res.redirect("/login"); // Redirect to the login page
    }
};
app.get('/dynamic', (req, res) => {
    res.render('index', { title: 'Dynamic Page' });
});
app.get('/login', (req: Request, res: Response) => {
    res.render("login.ejs")
});

app.get('/admin', async (req: Request, res: Response) => {
    const parcels = await Parcel.find();
    res.render("admin.ejs", { parcels })
});

app.get('/faqs', async (req: Request, res: Response) => {
    res.render("faq.ejs")
});

app.get('/about-us', async (req: Request, res: Response) => {
    res.render("about-us.ejs")
});

app.get('/contact', async (req: Request, res: Response) => {
    res.render("contact.ejs")
});

app.get('/cookie-policy', async (req: Request, res: Response) => {
    res.render("cookie-policy.ejs")
});

app.get('/privacy-policy', async (req: Request, res: Response) => {
    res.render("privacy-policy.ejs")
});

app.get('/tc', async (req: Request, res: Response) => {
    res.render("tc.ejs")
});

app.get('/testimonials', async (req: Request, res: Response) => {
    res.render("testimonials.ejs")
});

app.get('/createp', (req: Request, res: Response) => {
    // const authCookie = req.cookies.auth;

    // if (!authCookie) {
    //     return res.redirect("/login"); // Redirect to the login page if the user data cookie is not found
    // }
    res.render("createparcel.ejs")
});

app.get('/parcels', async (req: Request, res: Response) => {
    try {
        const parcels = await Parcel.find();

        // Render the parcels using a view template (e.g., EJS)
        res.render('admin.ejs', { parcels });
    } catch (error) {
        // Handle the error appropriately
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
});
type ProgressStatus = 'Order Received' | 'Processing' | 'In Transit' | 'Delivered';

const progress: Record<ProgressStatus, number> = {
    'Order Received': 25,
    'Processing': 45,
    'In Transit': 70,
    'Delivered': 100,
};

const colors: Record<ProgressStatus, string> = {
    'Order Received': 'bg-gray-500',
    'Processing': 'bg-yellow-700',
    'In Transit': 'bg-blue-500',
    'Delivered': 'bg-green-500',
};
// POST route to handle tracking number submission
app.post('/tracker', async (req: Request, res: Response) => {

    const parcelId = req.body.parcelId;
    console.log(parcelId)
    try {
        const parcel = await Parcel.findById(parcelId);

        if (!parcel) {
            throw new NotFoundException('Parcel not found.');
        }

        // Redirect to the tracker page with the parcel ID
        res.redirect(`/tracker?parcelId=${parcel._id}`);
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
});

// GET route to display tracking information
app.get('/tracker', async (req: Request, res: Response) => {
    const parcelId = req.query.parcelId as string;

    try {
        const parcel = await Parcel.findById(parcelId);

        if (!parcel) {
            return res.status(404).json({ error: 'Parcel not found' });
        }

        const status = parcel.status as ProgressStatus;
        const progressWidth = progress[status] || 0;
        const progressColor = colors[status] || 'bg-gray-500';

        res.render('tracker.ejs', { progressWidth, progressColor, parcel });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Assuming you have a Parcel model and an associated router

// GET route for rendering the edit form
app.get('/parcels/:id/edit', async (req, res) => {
    try {
        const parcelId = req.params.id;
        const parcel = await Parcel.findById(parcelId);

        if (!parcel) {
            throw new NotFoundException('Parcel not found');
        }

        res.render('editparcel', { parcel });
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
});
app.post('/parcels/:id/edit', async (req, res) => {
    // Retrieve the parcel ID from the request parameters
    const parcelId = req.params.id;
    try {
        const updatedParcel = {
            itemName: req.body.itemName,
            from: req.body.from,
            to: req.body.to,
            sender: req.body.sender,
            receiver: req.body.receiver,
            currentLocation: req.body.currentLocation,
            currentCondition: req.body.currentCondition,
            date: req.body.date,
            status: req.body.status
        };

        const parcel = await Parcel.updateOne({ _id: parcelId }, updatedParcel)
        //Gets all parcels and parce them
        const parcels = await Parcel.find();
        res.render('admin.ejs', { parcels });
        return parcel

    } catch (err) {

    }

});
app.post('/parcels/:id/delete', async (req, res) => {
    const parcelId = req.params.id;
    // Perform the deletion logic here, such as using a database query or API call
    await Parcel.deleteOne({ _id: parcelId })
    // Assuming the deletion is successful, you can redirect the user to the all parcels page
    const parcels = await Parcel.find();
    res.redirect('/admin');
});

app.post('/submit-parcel', (req: Request, res: Response) => {
    const { itemName, from, to, receiver, sender, currentLocation, date, status, currentCondition } = req.body;

    try {
        const parcelData = {
            itemName,
            from,
            to,
            receiver,
            currentLocation,
            date,
            status,
            sender,
            currentCondition
        }
        const parcel = Parcel.create(parcelData)
        res.redirect('/admin');
    } catch (err) {
        console.log(err)
    }
});
app.use((_req, res, _next) => {
    res.status(404).json({
        message: 'Resource does not exist',
    });
});
export default app;
import Header from './Header';
import Footer from './Footer';

const ContactPage = () => {
    const phoneNumber = '+467-22-33-44-55';
    const email = 'dailyharvest@mail.se';
    const address = 'T-centralen Stockholm';
    const googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`;

    return (
        <div className="app">
            <Header />
            <main className="main-content">
                <div className="contact-container">
                    <h2>Contact Us</h2>
                    <p className="contact-intro">We'd love to hear from you! Get in touch with us using the information below.</p>
                    
                    <div className="contact-info">
                        <div className="contact-item">
                            <h3>Phone</h3>
                            <a href={`tel:${phoneNumber}`} className="contact-link phone-link">
                                {phoneNumber}
                            </a>
                        </div>

                        <div className="contact-item">
                            <h3>Email</h3>
                            <a href={`mailto:${email}`} className="contact-link email-link">
                                {email}
                            </a>
                        </div>

                        <div className="contact-item">
                            <h3>Visit Us</h3>
                            <p className="address">{address}</p>
                            <a 
                                href={googleMapsUrl} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="contact-link maps-link"
                            >
                                View on Google Maps
                            </a>
                        </div>
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
};

export default ContactPage;

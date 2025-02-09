import './home.css';
import Lottie from "lottie-react";
import animation from "./landingAnimation.json";
import { motion } from 'framer-motion';
//  import Typewriter from 'typewriter-effect';
import Gif1 from "./gif1.json";

const Home = () => {
    return (
        <div className="App">
            {/* Navbar */}
            <motion.div 
                className="navbar" 
                initial={{ opacity: 0, y: -20 }} 
                animate={{ opacity: 1, y: 0 }} 
                transition={{ duration: 1 }}
            >
                <h2 className="heading">taskify</h2>
                <a href="/dashboard" className='dash'>Dashboard</a>
            </motion.div>

            {/* Main Content */}
            <div className="main">
                <div className="main-text">
                    <motion.h1 
                        className="tagline"
                        initial={{ opacity: 0, scale: 0.9 }} 
                        animate={{ opacity: 1, scale: 1 }} 
                        transition={{ duration: 1 }}
                    >
                        Tasks in Line, Every Time!
                    </motion.h1>

                    <div className="typewriter-container">
                        {/* <Typewriter
                            options={{
                                strings: ['Automate Your Workflows', 'No Code Needed!', 'Save Hours of Work', 'Effortless Task Management', 'Boost Your Productivity'],
                                autoStart: true,
                                loop: true,
                                delay: 50,
                            }}
                        /> */}
                    </div>
                    <p className="desc">
                        Connect your favorite apps, automate tasks, and save hours of manual work with a simple drag-and-drop interface. No coding required!
                    </p>
                    <motion.a 
                        href="/dashboard" 
                        className="cta-button"
                        whileHover={{ scale: 1.1 }} 
                        whileTap={{ scale: 0.9 }}
                    >
                        Get Started
                    </motion.a>
                </div>
                
                <motion.div 
                    className="lottie" 
                    initial={{ opacity: 0, x: 50 }} 
                    animate={{ opacity: 1, x: 0 }} 
                    transition={{ duration: 1 }}
                >
                    <Lottie 
                        animationData={Gif1} 
                        loop={true} 
                        style={{ width: '400px', height: '400px' }}  // Adjust size here
                    />
                </motion.div>
            </div>

            {/* Features Section */}
            <motion.div 
                className="features"
                initial={{ opacity: 0 }} 
                animate={{ opacity: 1 }} 
                transition={{ duration: 1.5 }}
            >
                <h2 className="feature-heading">Why Choose Taskify?</h2>
                <div className="feature-container">
                    <motion.div className="feature-card large" whileHover={{ scale: 1.1 }}>
                        <h3>🚀 No-Code Automation</h3>
                        <p>Drag and drop to create workflows. No programming knowledge needed!</p>
                    </motion.div>

                    <motion.div className="feature-card large" whileHover={{ scale: 1.1 }}>
                        <h3>🔄 Seamless Integration</h3>
                        <p>Connect with 100+ apps like Gmail, Google Sheets, Slack, Trello, Asana, and more.</p>
                    </motion.div>

                    <motion.div className="feature-card large" whileHover={{ scale: 1.1 }}>
                        <h3>⏳ Save Time & Effort</h3>
                        <p>Eliminate repetitive tasks and focus on what matters most. Automate workflows with precision.</p>
                    </motion.div>

                    <motion.div className="feature-card large" whileHover={{ scale: 1.1 }}>
                        <h3>🔒 Secure & Reliable</h3>
                        <p>Your data is encrypted and safe. Enjoy seamless and secure automation.</p>
                    </motion.div>
                </div>
            </motion.div>


            {/* Footer */}
            <motion.footer 
                className="footer"
                initial={{ opacity: 0 }} 
                animate={{ opacity: 1 }} 
                transition={{ duration: 2 }}
            >
                <p>© 2025 Taskify. All rights reserved.</p>
                <div className="footer-links">
                    <a href="#">Privacy Policy</a>
                    <a href="#">Terms of Service</a>
                    <a href="#">Contact Us</a>
                    <a href="#">About Us</a> {/* Link to About Us section */}
                    <a href="#">Help Center</a>
                </div>
            </motion.footer>
        </div>
    );
}

export default Home;

/**
 * pages.config.js - Page routing configuration
 * 
 * This file is AUTO-GENERATED. Do not add imports or modify PAGES manually.
 * Pages are auto-registered when you create files in the ./pages/ folder.
 * 
 * THE ONLY EDITABLE VALUE: mainPage
 * This controls which page is the landing page (shown when users visit the app).
 * 
 * Example file structure:
 * 
 *   import HomePage from './pages/HomePage';
 *   import Dashboard from './pages/Dashboard';
 *   import Settings from './pages/Settings';
 *   
 *   export const PAGES = {
 *       "HomePage": HomePage,
 *       "Dashboard": Dashboard,
 *       "Settings": Settings,
 *   }
 *   
 *   export const pagesConfig = {
 *       mainPage: "HomePage",
 *       Pages: PAGES,
 *   };
 * 
 * Example with Layout (wraps all pages):
 *
 *   import Home from './pages/Home';
 *   import Settings from './pages/Settings';
 *   import __Layout from './Layout.jsx';
 *
 *   export const PAGES = {
 *       "Home": Home,
 *       "Settings": Settings,
 *   }
 *
 *   export const pagesConfig = {
 *       mainPage: "Home",
 *       Pages: PAGES,
 *       Layout: __Layout,
 *   };
 *
 * To change the main page from HomePage to Dashboard, use find_replace:
 *   Old: mainPage: "HomePage",
 *   New: mainPage: "Dashboard",
 *
 * The mainPage value must match a key in the PAGES object exactly.
 */
import AIMoodCoach from './pages/AIMoodCoach';
import AnonymousSharing from './pages/AnonymousSharing';
import CalmZone from './pages/CalmZone';
import EmotionalMap from './pages/EmotionalMap';
import GratitudeWall from './pages/GratitudeWall';
import Home from './pages/Home';
import MoodBubbles from './pages/MoodBubbles';
import More from './pages/More';
import NudgeAI from './pages/NudgeAI';
import PositiveRipple from './pages/PositiveRipple';
import TimeCapsule from './pages/TimeCapsule';
import VoiceJournal from './pages/VoiceJournal';
import Splash from './pages/Splash';
import RippleEngine from './pages/RippleEngine';
import __Layout from './Layout.jsx';


export const PAGES = {
    "AIMoodCoach": AIMoodCoach,
    "AnonymousSharing": AnonymousSharing,
    "CalmZone": CalmZone,
    "EmotionalMap": EmotionalMap,
    "GratitudeWall": GratitudeWall,
    "Home": Home,
    "MoodBubbles": MoodBubbles,
    "More": More,
    "NudgeAI": NudgeAI,
    "PositiveRipple": PositiveRipple,
    "TimeCapsule": TimeCapsule,
    "VoiceJournal": VoiceJournal,
    "Splash": Splash,
    "RippleEngine": RippleEngine,
}

export const pagesConfig = {
    mainPage: "Home",
    Pages: PAGES,
    Layout: __Layout,
};
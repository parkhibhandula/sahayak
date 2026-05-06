import { createBrowserRouter } from "react-router";
import { LandingPage } from "./pages/landing-page";
import { Dashboard } from "./pages/dashboard";
import { CaretakerBooking } from "./pages/caretaker-booking";
import { TravelBooking } from "./pages/travel-booking";
import { Careers } from "./pages/careers";
import { About } from "./pages/about";
import { HowItWorks } from "./pages/how-it-works";
import { Impact } from "./pages/impact";
import { AccessibilityMap } from "./pages/accessibility-map";
import { CaretakerRegistration } from "./pages/caretaker-registration";
import { Community } from "./pages/community";


export const router = createBrowserRouter([
  {
    path: "/",
    Component: LandingPage,
  },
  {
    path: "/about",
    Component: About,
  },
  {
    path: "/how-it-works",
    Component: HowItWorks,
  },
  {
    path: "/impact",
    Component: Impact,
  },
  {
    path: "/careers",
    Component: Careers,
  },
  {
    path: "/dashboard",
    Component: Dashboard,
  },
  {
    path: "/accessibility-map",
    Component: AccessibilityMap,
  },
  {
    path: "/caretaker-booking",
    Component: CaretakerBooking,
  },
  {
    path: "/travel-booking",
    Component: TravelBooking,
  },
  {
    path: "/community",
    Component: Community,
  },
  {
    path: "/caretaker-registration",
    Component: CaretakerRegistration,
  },
  
]);

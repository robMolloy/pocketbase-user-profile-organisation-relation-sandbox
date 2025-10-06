import { BrowserRouter, useRoutes } from "react-router-dom";
import routes from "~react-pages";
import { LayoutTemplate } from "./components/templates/LayoutTemplate";
import { pb } from "./config/pocketbaseConfig";
import { Header } from "./modules/Header";
import { LeftSidebar } from "./modules/LeftSidebar";
import { useCurrentUserStore } from "./modules/auth/authDataStore";
import { useInitAuth } from "./modules/auth/useInitAuth";
import { smartSubscribeToUsers } from "./modules/auth/users/dbUsersUtils";
import { useUsersStore } from "./modules/auth/users/usersStore";
import { smartSubscribeToOrganisations } from "./modules/organisations/dbOrganisationUtils";
import { useOrganisationsStore } from "./modules/organisations/useOrganisationsStore";
import { useThemeStore } from "./modules/themeToggle/themeStore";

function App() {
  return useRoutes(routes);
}

function AppWrapper() {
  const themeStore = useThemeStore();
  const usersStore = useUsersStore();
  const currentUserStore = useCurrentUserStore();
  const organisationsStore = useOrganisationsStore();
  themeStore.useThemeStoreSideEffect();

  useInitAuth({
    pb: pb,
    onIsLoading: () => {},
    onIsLoggedIn: () => {
      smartSubscribeToUsers({ pb, onChange: (x) => usersStore.setData(x) });
      smartSubscribeToOrganisations({ pb, onChange: (x) => organisationsStore.setData(x) });
    },
    onIsLoggedOut: () => {},
  });

  return (
    <BrowserRouter basename={import.meta.env.VITE_APP_BASE_URL}>
      <LayoutTemplate
        Header={<Header />}
        LeftSidebar={currentUserStore.data.authStatus === "loggedIn" && <LeftSidebar />}
      >
        <App />
      </LayoutTemplate>
    </BrowserRouter>
  );
}

export default AppWrapper;

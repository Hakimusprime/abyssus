import { createBrowserRouter, Outlet } from "react-router";
import { Sidebar } from "./components/Sidebar";
import { Home } from "./pages/Home";
import { Profile } from "./pages/Profile";
import { Category } from "./pages/Category";
import { Catalog } from "./pages/Catalog";
import { QuizPlayer } from "./pages/QuizPlayer";
import { CreatorAdmin } from "./pages/CreatorAdmin";
import { EventsBoss } from "./pages/EventsBoss";

function Placeholder({ title = "Zone en cours de construction..." }: { title?: string }) {
  return (
    <div className="flex items-center justify-center h-64 text-muted-foreground font-display text-2xl animate-in fade-in">
      {title}
    </div>
  );
}

function Layout() {
  return (
    <div className="flex h-[100dvh] overflow-hidden bg-background relative text-text">
      {/* Abyssal Atmosphere */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden mix-blend-screen opacity-40">
        <div className="absolute -top-[20%] -left-[10%] w-[70%] h-[70%] bg-cyan/10 blur-[120px] rounded-full animate-smoke-1" />
        <div className="absolute top-[40%] -right-[20%] w-[60%] h-[80%] bg-indigo-900/10 blur-[150px] rounded-full animate-smoke-2" />
        <div className="absolute -bottom-[20%] left-[20%] w-[50%] h-[50%] bg-red-900/10 blur-[100px] rounded-full animate-smoke-3" />
      </div>

      <Sidebar />
      <main className="flex-1 overflow-y-auto relative z-10 pt-16 md:pt-0">
        <div className="p-4 md:p-8 min-h-full max-w-7xl mx-auto pb-24 md:pb-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
}

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      { index: true, element: <Home /> },
      { path: "profile", element: <Profile /> },
      { path: "penseurs", element: <Category id="penseurs" /> },
      { path: "otaku", element: <Category id="otaku" /> },
      { path: "culture", element: <Category id="culture" /> },
      { path: "catalog", element: <Catalog /> },
      { path: "quiz", element: <QuizPlayer /> },
      { path: "events", element: <EventsBoss /> },
      { path: "creator", element: <CreatorAdmin /> },
      { path: "leaderboards", element: <Placeholder title="Hall des Légendes" /> },
      { path: "relics", element: <Placeholder title="Reliques Abyssales (Prochainement)" /> },
      { path: "titles", element: <Placeholder title="Titres (Prochainement)" /> },
      { path: "inventory", element: <Placeholder title="Inventaire et Armes" /> },
      { path: "community", element: <Placeholder title="Requêtes, Suggestions et Tournois" /> },
      { path: "settings", element: <Placeholder title="Paramètres du Sanctuaire" /> },
      { path: "*", element: <Placeholder title="Zone en cours de construction..." /> },
    ],
  },
]);

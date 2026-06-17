import { Toaster } from "@/components/ui/toaster";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClientInstance } from "@/lib/query-client";
import { pagesConfig } from "./pages.config";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import PageNotFound from "./lib/PageNotFound";
import { AuthProvider } from "@/lib/AuthContext"; // ✅ IMPORTANT

const { Pages = {}, Layout = null, mainPage } = pagesConfig || {};
const mainPageKey = mainPage || Object.keys(Pages)[0];

const MainPage =
  (mainPageKey && Pages[mainPageKey]) ||
  (() => <div>No Page</div>);

const LayoutWrapper = ({ children, currentPageName }) => {
  if (!Layout) return <>{children}</>;

  return (
    <Layout currentPageName={currentPageName}>
      {children}
    </Layout>
  );
};

function App() {
  return (
    <AuthProvider> {/* 🔥 THIS FIXES YOUR 403 */}
      <QueryClientProvider client={queryClientInstance}>
        <Router>
          <Routes>
            <Route
              path="/"
              element={
                <LayoutWrapper currentPageName={mainPageKey}>
                  <MainPage />
                </LayoutWrapper>
              }
            />

            {Object.entries(Pages).map(([path, Page]) => (
              <Route
                key={path}
                path={`/${path}`}
                element={
                  <LayoutWrapper currentPageName={path}>
                    <Page />
                  </LayoutWrapper>
                }
              />
            ))}

            <Route path="*" element={<PageNotFound />} />
          </Routes>
        </Router>

        <Toaster />
      </QueryClientProvider>
    </AuthProvider>
  );
}

export default App;
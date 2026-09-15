import LoadErrorScreen from "@/components/feedback/LoadErrorScreen";
import LoadingScreen from "@/components/feedback/LoadingScreen";
import useDatabase from "@/hooks/useDatabase";
import DashboardPage from "@/pages/DashboardPage";

/** Carrega a base de dados e decide o que mostrar: carregando, erro ou o painel. */
export default function App() {
  const { database, updatedAt, loading, refreshing, error, refresh } = useDatabase();

  if (database && updatedAt) {
    return (
      <DashboardPage
        database={database}
        updatedAt={updatedAt}
        refreshing={refreshing}
        refreshError={error}
        onRefresh={refresh}
      />
    );
  }

  if (loading) return <LoadingScreen />;

  return <LoadErrorScreen message={error} retrying={refreshing} onRetry={refresh} />;
}

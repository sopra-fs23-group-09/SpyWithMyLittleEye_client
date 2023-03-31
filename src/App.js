import Header from "components/views/Header";
import AppRouter from "components/routing/routers/AppRouter";

/**
 * Happy coding!
 * React Template by Lucas Pelloni
 * Overhauled by Kyrill Hux
 */
const App = () => {
  return (
    <div>
      <script> localStorage.clear(); </script>
      <Header height="100"/>
      <AppRouter/>
    </div>
  );
};

export default App;

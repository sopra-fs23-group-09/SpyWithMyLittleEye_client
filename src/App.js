import Header from "components/views/Header";
import AppRouter from "components/routing/routers/AppRouter";

/**
 * Happy coding!
 * React Template by Lucas Pelloni
 * Overhauled by Kyrill Hux
 */
const App = () => {
    window.onbeforeunload = () => {localStorage.removeItem('intervalId'); alert("You're leaving the game!")};

    return (
    <div>
      <script>
          localStorage.clear();
          window.onbeforeunload = () => localStorage.removeItem('intervalId');
      </script>
      <Header height="100"/>
      <AppRouter/>
    </div>
  );
};

export default App;

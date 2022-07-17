import {
  NavEnum,
  useNavigationBuilder,
  NavigationProvider,
} from "../navigation";
import { JeosProvider } from "./useJeos";
import { Header } from "./Header";
import { Modal } from "./Modal";
import { JeoFormPage } from "./JeoFormPage";
import { JeosPage } from "./JeosPage";
import { JeoPlay } from "./JeoPlay";
import "./App.css";

function App() {
  const navigation = useNavigationBuilder();

  return (
    <JeosProvider>
      <NavigationProvider value={navigation}>
        <Header />
        <div>
          <div>{navigation.page.type === NavEnum.Jeos && <JeosPage />}</div>
          <div>
            {navigation.page.type === NavEnum.JeoForm && <JeoFormPage />}
          </div>
        </div>
        {navigation.modal?.type === NavEnum.JeoPlay && (
          <Modal>
            <JeoPlay jeo={navigation.modal.jeo} />
          </Modal>
        )}
      </NavigationProvider>
    </JeosProvider>
  );
}

export default App;

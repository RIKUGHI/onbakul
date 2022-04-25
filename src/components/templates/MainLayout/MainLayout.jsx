import { Header } from '../..';
import './MainLayout.scss';

export default function MainLayout(props) {
  document.title = props.title

  return(
    <main>
      <Header title={props.title} />
      <div className="main-container">
        {props.children}
      </div>
    </main>
  )
}

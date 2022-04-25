import { Route } from "react-router-dom";
import { Redirect } from "react-router-dom/cjs/react-router-dom.min";
import { GlobalConsumer } from "./context";

function PrivateRoute(p) {
  return(
    <>
      {p.state.login ? (
        <Route path={p.path} component={p.component} />
      ) : <Redirect to={{pathname: '/'}} />}
    </>
  )
}

export default GlobalConsumer(PrivateRoute)
import { useLocation, useNavigate, useParams } from "react-router-dom";

export default function withRoute<ComponentProps>(Component: React.FunctionComponent<ComponentProps>) {
  function ComponentWithRouterProp(props: ComponentProps) {
      const location = useLocation();
      const navigate = useNavigate();
      const params = useParams();

      return <Component {...props} history={{ location, navigate, params }} />;
  }

  return ComponentWithRouterProp;
}

import Logo from "../../assets/logo-preto.png";
import { useContextSelector } from "use-context-selector";
import { AppContext } from "../../contexts/appContext";

const Header = () => {
  const avatar = useContextSelector(
    AppContext,
    (context) => context.profile.url_foto
  );

  console.log(avatar);

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-body-tertiary">
      <div className="container-fluid">
        <button
          data-mdb-collapse-init
          className="navbar-toggler"
          type="button"
          data-mdb-target="#navbarSupportedContent"
          aria-controls="navbarSupportedContent"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <i className="fas fa-bars"></i>
        </button>

        <div className="collapse navbar-collapse" id="navbarSupportedContent">
          <a className="navbar-brand mt-2 mt-lg-0" href="/">
            <img src={Logo} height="50" alt="MDB Logo" loading="lazy" />
          </a>

          <ul className="navbar-nav me-auto mb-2 mb-lg-0">
            <li className="nav-item">
              <a className="nav-link" href="#">
                Nexus
              </a>
            </li>
          </ul>
        </div>

        <div className="d-flex align-items-center">
          <img
            src={avatar}
            className="rounded-circle"
            height="50"
            alt="Avatar"
            loading="lazy"
          />
        </div>
      </div>
    </nav>
  );
};

export default Header;

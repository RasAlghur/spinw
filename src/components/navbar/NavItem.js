import { Link } from 'react-router-dom';

const NavItem = ({ text, url, active, icon }) => {

  return (
    <Link to={url} className={active ? 'activated' : 'nav__link'}>
      {icon}{text || ''}
    </Link>
  );
};

export default NavItem;

import { NavLink } from 'react-router-dom';
import { LogOut, User } from 'lucide-react';
import { NAV_LINKS } from '../../constants';
import styles from './Navbar.module.css';

export function Navbar({ user, onLogout }) {
  return (
    <header className={styles.header}>
      <div className={styles.inner}>
        <div className={styles.brand}>
          <div className={styles.logoMark}><span>FP</span></div>
          <div>
            <div className={styles.brandName}>FreshPress</div>
            <div className={styles.brandSub}>Laundry Concierge</div>
          </div>
        </div>

        <nav className={styles.nav}>
          {NAV_LINKS.map(link => (
            <NavLink
              key={link.path}
              to={link.path}
              end={link.path === '/'}
              className={({ isActive }) =>
                `${styles.navLink} ${isActive ? styles.active : ''}`
              }
            >
              {link.label}
            </NavLink>
          ))}
        </nav>

        <div className={styles.userArea}>
          <div className={styles.userInfo}>
            <div className={styles.userAvatar}>
              <User size={14} />
            </div>
            <div>
              <div className={styles.userName}>{user?.name}</div>
              <div className={styles.userRole}>{user?.role}</div>
            </div>
          </div>
          <button className={styles.logoutBtn} onClick={onLogout} title="Sign out">
            <LogOut size={15} />
          </button>
        </div>
      </div>
    </header>
  );
}

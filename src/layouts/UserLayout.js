import React from 'react';
import { Link, Route } from 'dva/router';
import DocumentTitle from 'react-document-title';
import { Icon } from 'antd';
import GlobalFooter from '../components/GlobalFooter';
import styles from './UserLayout.less';
import logo from '../assets/logo.png';
import { getRoutes } from '../utils/utils';

const links = [{
  title: '关于便利猫',
  href: '',
}, {
  title: '联系我们',
  href: '',
}, {
  title: '帮助文档',
  href: '',
}];

const copyright = <div> <Icon type="copyright" />Copyright © 2018 The Project by 便利猫 . All Rights Reserved</div>;

class UserLayout extends React.PureComponent {
  getPageTitle() {
    const { routerData, location } = this.props;
    const { pathname } = location;
    let title = '便利猫';
    if (routerData[pathname] && routerData[pathname].name) {
      title = `${routerData[pathname].name} - 便利猫`;
    }
    return title;
  }
  render() {
    const { routerData, match } = this.props;
    return (
      <DocumentTitle title={this.getPageTitle()}>
        <div className={styles.container}>
          <div className={styles.top}>
            <div className={styles.header}>
              <Link to="/">
                <img alt="logo" className={styles.logo} src={logo} />
                <span className={styles.title}>便利猫</span>
              </Link>
            </div>
            <div className={styles.desc}>&nbsp;</div>
          </div>
          {
            getRoutes(match.path, routerData).map(item =>
              (
                <Route
                  key={item.key}
                  path={item.path}
                  component={item.component}
                  exact={item.exact}
                />
              )
            )

          }
          <GlobalFooter className={styles.footer}  copyright={copyright} />
        </div>
      </DocumentTitle>
    );
  }
}

export default UserLayout;

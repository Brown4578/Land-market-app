import { useState, useEffect, useContext } from 'react';
import { UserOutlined, PoweroffOutlined } from '@ant-design/icons';
import { Layout, Menu, theme, Image, Modal, Tooltip } from 'antd';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { NavigationItems } from '../../../config/navigation';
import './assets/css/index.css';
import headerLogo from '../../../assets/img/favicon/logo-no-background-small.svg';
const { Header, Content, Footer, Sider } = Layout;
import { SketchPicker } from 'react-color';
import { companyDetailsService, userService } from '../../../_services';
import 'react-perfect-scrollbar/dist/css/styles.css';
import PerfectScrollbar from 'react-perfect-scrollbar';
import { useUserContext } from '../../../_helpers/userContext';

const { SubMenu } = Menu;

const Home = () => {
  const navigate = useNavigate();
  const colorValue = '#ffffff';
  const currentYear = new Date().getFullYear();
  const { user, updateUserContext, updateCompanyName, companyName } =
    useUserContext();
  const [collapsed, setCollapsed] = useState(false);
  const [color, setColor] = useState('#ffffff');
  const [visible, setVisible] = useState(false);
  const [openKeys, setOpenKeys] = useState(['/']);
  const [navItems, setNavItems] = useState([]);

  useEffect(() => {
    if (!user) {
      handleFetchMyUserInfo();
      fetchCompanyName();
    }
  }, []);

  useEffect(() => {
    if (user) {
      const filteredMenuData = filterMenuData(
        user.permissions.map((p) => p.permissionName),
        NavigationItems
      );

      setNavItems(filteredMenuData);
    }
  }, [user]);

  useEffect(() => {
    if (!colorValue) {
      localStorage.setItem('theme', color);
    }
  }, [colorValue]);

  const handleFetchMyUserInfo = (params) => {
    userService.fetchMe(params).then((resp) => {
      const body = resp.data.body;
      updateUserContext(body);
    });
  };
  const fetchCompanyName = (params) => {
    companyDetailsService
      .fetchCompanyDetails(params)
      .then((response) => {
        const respData = response?.data?.companyName || '';
        updateCompanyName(respData);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  function filterMenuData(permissions, data) {
    return data.filter((item) => {
      if (permissions.includes(item.permission)) {
        if (item.children) {
          item.children = filterMenuData(permissions, item.children);
        }
        return true;
      }
      return false;
    });
  }

  const handleShowProfileClick = () => {};

  const handleLogoutClick = () => {
    userService.logout();
  };

  const handleModalCancel = () => {
    setVisible(false);
  };

  const handleColorChange = (color) => {
    if (color) {
      setColor(color.hex);
      localStorage.setItem('theme', color.hex);
    }
  };

  const handleSettingsClick = () => {
    Modal.confirm({
      title: 'Change Theme',
      content: <SketchPicker color={color} onChange={handleColorChange} />,
      style: {
        position: 'absolute',
        right: '20px',
        top: '50%',
        marginTop: '-45vh',
        height: '100vh',
        maxWidth: 'unset',
        minWidth: 'unset',
        width: '250px',
      },
      onOk: () => {
        return;
      },
    });
  };

  const handleOpenChange = (keys) => {
    if (keys.length > 1) {
      keys.shift();
    }
    setOpenKeys(keys);
  };

  return (
    <Layout
      style={{
        height: '100vh',
        background: ` ${colorValue} !important`,
      }}
      hasSider
    >
      <Sider
        // style={{ background: ` ${colorValue}` }}
        style={{ background: ` ${colorValue}` }}
        collapsible
        collapsed={collapsed}
        onCollapse={(value) => setCollapsed(value)}
        width={239}
        breakpoint='md'
      >
        <div className='image-div'>
          <Image
            style={{
              height: '100%',
              paddingTop: '0px !important',
            }}
            id={'header-logo'}
            preview={false}
            alt={'Kiganjo Land Registry'}
            src={headerLogo}
          />
        </div>

        <div>
          <PerfectScrollbar style={{ height: '87vh', maxHeight: '87vh' }}>
            <Menu
              // theme={'dark'}
              theme={'light'}
              defaultSelectedKeys={[useLocation().pathname]}
              openKeys={openKeys}
              mode='inline'
              items={navItems}
              onOpenChange={handleOpenChange}
              defaultOpenKeys={[openKeys]}
              onClick={(item) => navigate(item.key)}
            />
          </PerfectScrollbar>
        </div>
        {/* <div className='ant-layout-sider-trigger' /> */}
      </Sider>
      <Layout className='site-layout'>
        <Header
          style={{
            display: 'flex',
            justifyContent: 'end',
            background: '#1c4059',
            height: '45px',
            position: 'sticky',
            top: '0',
          }}
        >
          <div
            style={{
              width: '100%',
              color: 'white',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              gap: '1rem',
              overflow: 'hidden',
            }}
          >
            <div
              style={{
                marginRight: 'auto',
              }}
            >
              {companyName && (
                <span
                  style={{
                    background: '#2e6d98',
                    cursor: 'default',
                    fontWeight: 'bold',
                    color: 'white',
                    fontSize: '13.5px',
                    padding: '5px',
                    boxShadow: '10px 10px 7px -8px rgba(0,0,0,0.34) inset',
                    borderRadius: '5px',
                  }}
                >
                  {companyName}
                </span>
              )}
            </div>
            <div style={{ marginLeft: 'auto' }}>
              Hi, {user?.fullName ?? '!'}
              <>
                <UserOutlined
                  onClick={() => setVisible(true)}
                  style={{ color: 'white', fontSize: '15px' }}
                />
                <Modal
                  title='My Profile'
                  open={visible}
                  onCancel={handleModalCancel}
                  footer={null}
                  style={{
                    position: 'absolute',
                    right: '20px',
                    top: '50%',
                    marginTop: '-45vh',
                    height: '100vh',
                    width: '250px',
                    maxWidth: '300px',
                    minWidth: '250px',
                  }}
                >
                  <Menu mode='inline'>
                    <SubMenu
                      key='sub1'
                      icon={<UserOutlined />}
                      title='Manage Profile'
                    >
                      <Menu.Item key='1' onClick={handleShowProfileClick}>
                        Personal info
                      </Menu.Item>
                      <Menu.Item key='2' onClick={handleShowProfileClick}>
                        Personalization
                      </Menu.Item>
                      <Menu.Item key='3' onClick={handleShowProfileClick}>
                        Security
                      </Menu.Item>
                    </SubMenu>
                    <Menu.Item
                      key='13'
                      icon={<PoweroffOutlined style={{ color: 'red' }} />}
                      onClick={handleLogoutClick}
                    >
                      Sign out
                    </Menu.Item>
                  </Menu>
                </Modal>
              </>
            </div>
          </div>
        </Header>
        <Content
          style={{
            overflow: 'auto',
          }}
        >
          <div
            className={'outer-outlet'}
            style={{
              backgroundColor: ` ${colorValue}`,
              width: '300px !important',
            }}
          >
            <div
              className={'outlet'}
              style={{ borderRight: `10px solid ${colorValue}` }}
            >
              <PerfectScrollbar style={{ height: '95vh' }}>
                <Outlet />
              </PerfectScrollbar>
            </div>
          </div>
        </Content>
        <Footer
          style={{
            textAlign: 'center',
            position: 'sticky',
            bottom: 0,
            width: '100%',
            // background: 'linear-gradient(to bottom, #000033, #000066)',
            background: '#b7b7b7',
            height: '20px',
            lineHeight: '0px',
            color: 'white',
            padding: '18px',
          }}
        >
          Afrikib ©{currentYear} All rights reserved
        </Footer>
      </Layout>
    </Layout>
  );
};

export default Home;

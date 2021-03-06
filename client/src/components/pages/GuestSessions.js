import React from "react";
import { Redirect } from "react-router-dom";
import { connect } from "react-redux";
import styled from "styled-components";

// antd
import { Layout, Row, Col, Modal, Button } from "antd";

import SessionForm from "../forms/SessionForm";
import SessionsList from "../lists/SessionsList";
import Map from "../map/Map";
import Navbar from "../header/Navbar";

class GuestSessions extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      center: {
        lat: null,
        lng: null
      },
      modalVisible: false,
    };
    this.showModal = this.showModal.bind(this);
    this.handleCancel = this.handleCancel.bind(this);

  }
componentWillMount() {
}
  showModal = () => {
    this.setState({
      modalVisible: true
    });
  };
  
  handleCancel = () => {
    this.setState({ modalVisible: false });
  }

  componentWillReceiveProps(nextProps) {
      if (nextProps.newSession) {
        let isModalVisible = this.state.modalVisible;
        this.setState ({ modalVisible: !isModalVisible})
      }
  }

  render() {
    
    const colors = {
      grey: '#7d88a1 !important',
      inactiveGrey: 'rgba(0, 0, 0, 0.25) !important',
      activeViolet: '#4834d4 !important',
      hoverViolet: '#686de0 !important'
    }

    const StyledLayout = styled(Layout)`
      min-height: 100vh;
      background: #606c88;
      background: -webkit-linear-gradient(to top, #4834d4, #606c88);
      background: linear-gradient(to top, #4834d4, #606c88);
    `;
    const SubTitle = styled.h2`
      color: white;
      margin: 1rem 0 2rem 0;
      font-size: 2rem;
      font-family: "Lato", "Monospaced Number";
      font-style: italic;
    `;
    
    const ButtonAddSession = styled(Button)`
    border-radius: 20px
    border: none;
    margin: 0 auto;
    padding: 10px 25px;
    height:40px;
    line-height: 0;
    &:hover {
      color: ${colors.hoverViolet}
    }
    `;

    const StyledModal = styled(Modal)`
    position: absolute;
    top: 200px;
    left: 350px;
    font-family: "Lato", sans-serif;
      > div {
        width: 500px;
      }
      .ant-modal-header {
        text-align: center;
        .ant-modal-title {
          letter-spacing: 0.1em;
          color: ${colors.activeViolet}
        }
    `

    let redirect;
    if (!this.props.artist._id) {
      console.log("redirect from guestsessions");
      redirect = <Redirect to="/" />;
    }


    return (
      <StyledLayout>
        <Navbar />
        {redirect}
        <Row type="flex" justify="center">
          <Col xs={24} md={16} align="middle">
            <SubTitle>Welcome, {this.props.artist.name} !</SubTitle>
            <ButtonAddSession onClick={this.showModal}>Add a spot</ButtonAddSession>
            <SessionsList />
            <StyledModal
              bodyStyle={{background : '#4f4db3'}}
              title="New session infos"
              visible={this.state.modalVisible}
              onCancel={this.handleCancel}
              footer={null}
              >
            <SessionForm />
          </StyledModal>
          </Col>
          <Col span={8} align="middle">
            <Map />
          </Col>
        </Row>
      </StyledLayout>
    );
  }
}

// send cityCoords to the reducer
const mapDispatchToProps = (dispatch, props) => {
  return {
    sendCityCoords: value => {
      dispatch({ type: "NEW_CITY_COORDS", cityCoords: value });
    }
  };
};

const mapStateToProps = state => {
  // state.sendCityCoords reçu via sendCityCoords.reducer devient props.newCity
  return {
    artist: state.sendLoggedArtist,
    newSession: state.sendNewSession,
  };
};

const GuestSessionsRedux = connect(mapStateToProps, mapDispatchToProps)(
  GuestSessions
);

export default GuestSessionsRedux;

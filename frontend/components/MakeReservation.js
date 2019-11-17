import React, { Component } from 'react';
import gql from 'graphql-tag';
import { Mutation } from 'react-apollo';
import Router from 'next/router';
import styled from 'styled-components';

// import DatePicker from 'react-datepicker';
// import DateTimePicker from 'react-widgets/lib/DateTimePicker';

// import 'react-widgets/dist/css/react-widgets.css';
// import 'react-datepicker/dist/react-datepicker-cssmodules.css';

import Form from './styles/Form';
import Error from './ErrorMessage';
import { CURRENT_USER_QUERY } from './User';
import { ALL_RESERVATIONS_QUERY } from './Reservations';

const RESERVE_MUTATION = gql`
  mutation RESERVE_MUTATION(
    $checkIn: DateTime!
    $checkOut: DateTime!
    $roomType: String!
  ) {
    createReservation(
      checkIn: $checkIn
      checkOut: $checkOut
      roomType: $roomType
    ) {
      id
      checkIn
      checkOut
      roomType
    }
  }
`;

const StyledPage = styled.div`
  height: 100vh;
`;

class MakeReservation extends Component {
  state = {
    checkIn: '',
    checkOut: '',
    roomType: 'Deluxe Full'
  };
  saveToState = e => {
    this.setState({ [e.target.name]: e.target.value });
  };
  saveCheckinDate = date => {
    this.setState({ checkIn: date });
  };
  saveCheckoutDate = date => {
    this.setState({ checkOut: date });
  };
  render() {
    return (
      <StyledPage>
        <Mutation
          mutation={RESERVE_MUTATION}
          variables={this.state}
          refetchQueries={[
            { query: CURRENT_USER_QUERY, query: ALL_RESERVATIONS_QUERY }
          ]}
        >
          {(createReservation, { error, loading }) => {
            return (
              <Form
                method='post'
                onSubmit={async e => {
                  e.preventDefault();
                  await createReservation();
                  this.setState({
                    checkIn: '',
                    checkOut: '',
                    roomType: 'Deluxe Full'
                  });
                  if (!error) {
                    Router.push({
                      pathname: '/index'
                    });
                  }
                }}
              >
                <fieldset disabled={loading} aria-busy={loading}>
                  <h2>Make a Reservation</h2>
                  <Error error={error} />
                  <label htmlFor='checkIn'>
                    Check In
                    <br />
                    <input
                      type='date'
                      name='checkOut'
                      value={this.state.checkOut}
                      onChange={e => this.saveToState(e)}
                    />
                    {/* <Datepicker
                      selected={this.state.checkIn}
                      value={this.state.checkIn}
                      onChange={this.saveCheckinDate}
                    /> */}
                  </label>
                  <label htmlFor='checkOut'>
                    Check Out
                    <br />
                    <input
                      type='date'
                      name='checkIn'
                      value={this.state.checkIn}
                      onChange={e => this.saveToState(e)}
                    />
                  </label>
                  <label htmlFor='roomType'>
                    Room Type
                    <select name='roomType' onChange={this.saveToState}>
                      <option value='Deluxe Full'>Deluxe Full</option>
                      <option value='Deluxe Queen'>Deluxe Queen</option>
                      <option value='Deluxe Twin'>Deluxe Twin</option>
                      <option value='Suite'>Suite</option>
                    </select>
                  </label>
                  <button type='submit'>Reserve</button>
                </fieldset>
              </Form>
            );
          }}
        </Mutation>
      </StyledPage>
    );
  }
}

export default MakeReservation;

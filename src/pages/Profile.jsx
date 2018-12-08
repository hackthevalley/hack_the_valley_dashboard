import React, {Component} from 'react';
import {connect} from 'react-redux';
import '../scss/pages/profile.scss';
import {getMeAction, updateHackerAction} from '../redux/actions';
import {selectHackersMe} from '../selectors';
import SchoolNameServiceProvider from "../providers/SchoolNameServiceProvider";
import {Hacker} from "../models";
import {ErrorCodes} from "../components/ErrorCodes";

class _Profile extends Component {

  constructor(props) {
    super(props);
    this.schoolList = SchoolNameServiceProvider.getList();
    this.state = {
      // The actual hacker's profile
      me: new Hacker({})
    };
  }

  componentDidMount() {
    const {dispatch} = this.props;
    dispatch(getMeAction());
  }

  componentDidUpdate(prevProps) {
    const { me } = this.props;
    // Update this.state.me if a new prop is received
    if (me !== prevProps.me) {
      this.setState({ me })
    }
  }

  handleUpdateMe = async (event) => {
    const {dispatch} = this.props;
    event.preventDefault();
    this.setState({
      updateMeErrorCodes: false,
    });
    const formData = new FormData(event.target);
    // TODO: This can be simplified by using component state
    const action = await dispatch(updateHackerAction(this.state.me._id, {
      first_name: formData.get('first_name') || null,
      last_name: formData.get('last_name') || null,
      gender: formData.get('gender') || null,
      dob: formData.get('dob') || null,
      school: formData.get('school') || null,
      github: formData.get('github') || null,
      linkedin: formData.get('linkedin') || null,
      website: formData.get('website') || null,
      phone_number: formData.get('phone_number') || null,
      description: formData.get('description') || null,
    }));
    if (action.error) {
      this.setState({
        updateMeErrorCodes: action.error.errorCodes,
      });
    }
  };

  handleTextChange = (e) => {
    // First shallow copy a hacker instance
    let newHacker = this.state.me.shallowCopy();
    // Set new data, and set state
    newHacker.set(e.target.name, e.target.value);
    this.setState({me: newHacker});
  };

  render() {

    if(!this.props.me) {
      return <p><i className="fa fa-spinner fa-spin" aria-hidden="true" /></p>
    }

    return (
      <form className="profile" onSubmit={this.handleUpdateMe}>
        <h1 className="profile__header">Profile</h1>
        <h2>Personal Information</h2>
          <small>Fill out your information so we can know a bit about you!</small>
          <br/>
        <div className="profile__content">
          <div className="profile__col">
            <div className="profile__form-item profile__form-item--avatar">
              <label className="profile__label" htmlFor="avatar">Profile Image</label>
              <div className="profile__avatar-wrapper">
                <img id="avatar" className="profile__avatar" alt="Your uploaded profile" src={this.state.me.avatar} />
              </div>
            </div>
          </div>
          <div className="profile__col">
            <div className={`profile__form-item ${this.state.me.first_name ? "" : "profile__form-item--error"}`}>
              <label className="profile__label" htmlFor="first_name">First Name *</label>
              <input
                id="first_name"
                type="text"
                className="profile__input"
                name="first_name"
                value={this.state.me.first_name}
                autoComplete="given-name"
                onChange={this.handleTextChange}
                placeholder="john"
              />
            </div>
            <div className={`profile__form-item ${this.state.me.last_name ? "" : "profile__form-item--error"}`}>
              <label className="profile__label" htmlFor="last_name">Last Name *</label>
              <input
                id="last_name"
                type="text"
                className="profile__input"
                name="last_name"
                value={this.state.me.last_name}
                onChange={this.handleTextChange}
                autoComplete="family-name"
                placeholder="doe"
              />
            </div>
            <div className={`profile__form-item ${this.state.me.phone_number ? "" : "profile__form-item--error"}`}>
              <label className="profile__label" htmlFor="last_name">Phone Number *</label>
              <input
                id="phone_number"
                type="text"
                className="profile__input"
                name="phone_number"
                value={this.state.me.phone_number}
                onChange={this.handleTextChange}
                placeholder="123-456-7890"
              />
            </div>

            <div className="profile__form-item">
              <label className="profile__label" htmlFor="gender">Gender</label>
              <select
                id="gender"
                name="gender"
                className="profile__input"
                value={this.state.me.gender}
                onChange={this.handleTextChange}
                autoComplete="sex"
              >
                <option value="">Prefer not to answer</option>
                <option value="female">Female</option>
                <option value="male">Male</option>
                <option value="other">Other</option>
              </select>
            </div>

            <div className={`profile__form-item ${this.state.me.dob ? "" : "profile__form-item--error"}`}>
              <label className="profile__label" htmlFor="dob">
                  Date of birth *<br/>
                  <small>This is used to determine your eligibility for our events.</small>
              </label>
              <input
                id="dob"
                type="date"
                className="profile__input"
                name="dob"
                value={this.state.me.dob}
                onChange={this.handleTextChange}
                autoComplete="bday"
              />
            </div>
          </div>
        </div>

        <h2>Additional Information</h2>
        <div className="profile__content">
          <div className="profile__form-item profile__col">
            <label className="profile__label" htmlFor="email_address">Email address</label>
            <input
              id="email_address"
              type="email"
              className="profile__input"
              name="email_address"
              value={this.state.me.email_address}
              autoComplete="email"
              placeholder="john.doe@example.com"
              disabled
            />
          </div>

          <div className={`profile__form-item profile__col ${this.state.me.school ? "" : "profile__form-item--error"}`}>
            <label className="profile__label" htmlFor="dob">University / School *</label>
            <input
              id="school"
              type="text"
              className="profile__input"
              name="school"
              value={this.state.me.school}
              autoComplete="off"
              onChange={this.handleTextChange}
              list="data-schools"
            />
          </div>

          <div className="profile__form-item profile__col">
            <label className="profile__label" htmlFor="github">GitHub</label>
            <input
              id="github"
              type="text"
              className="profile__input"
              name="github"
              value={this.state.me.github}
              onChange={this.handleTextChange}
              autoComplete="url"
            />
          </div>

          <div className="profile__form-item profile__col">
            <label className="profile__label" htmlFor="linkedin">LinkedIn</label>
            <input
              id="linkedin"
              type="text"
              className="profile__input"
              name="linkedin"
              value={this.state.me.linkedin}
              onChange={this.handleTextChange}
              autoComplete="url"
            />
          </div>

          <div className="profile__form-item profile__col">
            <label className="profile__label" htmlFor="website">Website/Portfolio</label>
            <input
              id="website"
              type="text"
              className="profile__input"
              name="website"
              value={this.state.me.website}
              onChange={this.handleTextChange}
              autoComplete="url"
            />
          </div>
        </div>

        <h2>Optional Information</h2>
        <div className="profile__content">
          <div className="profile__form-item profile__col profile__col--full">
            <label className="profile__label" htmlFor="description">
                Bio<br/>
                <small>Tell us more about you! For example what sport do you play.</small>
            </label>

            <textarea
              id="description"
              name="description"
              className="profile__input profile__input--textarea"
              autoComplete="off"
              rows="6"
              onChange={this.handleTextChange}
              value={this.state.me.description}
            />
          </div>
        </div>
          <div className="profile__form-item">
            <input type="submit" value="Save" className="profile__button" disabled={this.props.fetchCount > 0}/>
          </div>

        <ErrorCodes errorCodes={this.state.updateMeErrorCodes}/>
        <datalist id="data-schools">
          {this.schoolList.map(name => <option key={name}>{name}</option>)}
        </datalist>
      </form>
    )
  }
}

export const Profile = connect((state) => ({
  me: selectHackersMe(state),
  fetching: state.fetch.fetching,
  fetchCount: state.fetch.fetchCount
}))(_Profile);

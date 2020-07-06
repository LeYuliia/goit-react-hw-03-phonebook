import React, { Component } from "react";

import ContactForm from "./components/ContactForm/ContactForm";
import ContactList from "./components/ContactList/ContactList";
import Filter from "./components/Filter";

import { saveToLS, getFromLS } from "./utils/localStorage";

import { v4 as uuidv4 } from "uuid";

import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

class App extends Component {
  state = {
    contacts: [],
    filter: "",
  };

  addContact = ({ name, number }) => {
    const contact = {
      name,
      number,
      id: uuidv4(),
    };
    const { contacts } = this.state;
    const findName = contacts.find((cnt) => cnt.name === name);
    const findNumber = contacts.find((cnt) => cnt.number === number);
 
    if (!name || !number) {
      toast.warn("Please,  fill in all fields", {
        position: "top-right",
        autoClose: 5000,
      });
      
    } else if (findName || findNumber) {
      toast.info(
        `Contact with name ${name} or phone number ${number} is already on your list`,
        {
          position: "top-center",
          autoClose: 5000,
        }
      );
      
    } else {
      this.setState(({ contacts }) => ({
        contacts: [contact, ...contacts],
      }));
    }
  };

  deleteContact = (contactId) => {
    this.setState((prevState) => ({
      contacts: prevState.contacts.filter(
        (contact) => contact.id !== contactId
      ),
    }));
  };

  changeFilter = (e) => {
    this.setState({ [e.currentTarget.name]: e.currentTarget.value });
  };

  getVisibleContacts = () => {
    const { filter, contacts } = this.state;
    const normalizedFilter = filter.toLowerCase();
    return contacts.filter((contact) =>
      contact.name.toLowerCase().includes(normalizedFilter)
    );
  };

 
  componentDidUpdate(prevState) {
    if (this.state.contacts !== prevState.contacts) {
      saveToLS("contacts", this.state.contacts);
    }
  }

  componentDidMount() {
    if (getFromLS("contacts")) {
      this.setState({ contacts: getFromLS("contacts") });
    }
  }
  render() {
    const visibleContacts = this.getVisibleContacts();
    return (
      <>
        <section className="add-contact">
          <h1 className="title">Phonebook</h1>
          <ContactForm onSubmit={this.addContact} />
        </section>
        <section className="contacts">
          <h2 className="title">Contacts</h2>
          {this.state.contacts.length > 2 && (
            <Filter filter={this.state.filter} onChange={this.changeFilter} />
          )}

          <ContactList
            contacts={visibleContacts}
            onDeleteContact={this.deleteContact}
          />
        </section>
        <ToastContainer />
      </>
    );
  }
}

export default App;

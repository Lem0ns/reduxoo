import { MapIndex } from "../..";

/**
 * A basic CRUD API example with a Reduxoo.MapIndex
 */
export default class Documents extends MapIndex {

  constructor() {
    super(); // Default state is an empty Object
  }

  // This looks just like our simple Index fetch, because it is!
  async read() {
    let res = await window.fetch('/documents');

    // Return the user json if 2xx OK response, else null
    let documents = res.ok ? await res.json() : null;

    // Replaces the existing map with this new document map
    await this.setState(documents);
  }

  // Removes the document from the store
  async delete(document) {
    let res = await window.fetch('/document/' + document._id, {
      method: 'DELETE',
      headers: {
        'Accept': 'application/json',
      }
    });

    if (!res.ok)
      throw new Error("Unable to remove document!");

    // Parse our response
    let json = await res.json();
    if (json.error)
      throw new Error(json.error);

    // Remove from this index
    this.remove(document);
  }

  // Adds a document
  async create(document) {
    let res = await window.fetch('/document', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(document)
    });

    if (!res.ok)
      throw new Error("Unable to add document!");

    // Parse our response
    let json = await res.json();
    if (json.error)
      throw new Error(json.error);

    // Set the given ID to this
    this.set(json._id, json);
  }

  async update(document) {
    let res = await window.fetch('/document', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(document)
    });

    if (!res.ok)
      throw new Error("Unable to add document!");

    // Parse our response
    let json = await res.json();
    if (json.error)
      throw new Error(json.error);

    // Set the given ID to this
    this.set(json._id, json);
  }
}
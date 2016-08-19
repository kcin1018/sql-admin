import Ember from 'ember';

const { isEmpty } = Ember;
const storage = requireNode('electron-storage');
const validDbTypes = ['postgres', 'mysql', 'mssql'];
const databaseFilePath = 'sql-admin/databases.json';

export default Ember.Route.extend({
  model() {
    return storage.get(databaseFilePath).then((data) => {
      return data;
    }).catch((error) => {
      console.error(error);
      this.get('flashMessages').danger('error');
      return [];
    });
  },

  setupController(controller) {
    this._super(...arguments);

    controller.set('newDb', {});
    controller.set('dbTypes', [{ id: 'postgres', text: 'Postgres' }, { id: 'mysql', text: 'MySql' }, { id: 'mssql', text: 'MSSql' }]);
  },

  resetController(controller, isExiting) {
    if (isExiting) {
      controller.set('newDb', {});
      this.set('currentDatabase', null);
    }
  },

  validateCreateDatabaseFormValid(newDb) {
    if (isEmpty(newDb.name)) {
      this.get('flashMessages').danger('Please enter a name for the connection');
      return;
    }

    if (isEmpty(newDb.type) || validDbTypes.indexOf(newDb.type.id) === -1) {
      this.get('flashMessages').danger('Please select a database type');
      return;
    }

    if (isEmpty(newDb.host)) {
      this.get('flashMessages').danger('Please enter a host to connect to');
      return;
    }

    if (isEmpty(newDb.database)) {
      this.get('flashMessages').danger('Please enter a database name to connect to');
      return;
    }

    if (isEmpty(newDb.username)) {
      this.get('flashMessages').danger('Please enter a username for the connection');
      return;
    }

    if (isEmpty(newDb.password)) {
      this.get('flashMessages').danger('Please enter a password for the connection');
      return;
    }

    if (isEmpty(newDb.port)) {
      this.get('flashMessages').danger('Please enter a port for the connection');
      return;
    }

    return true;
  },

  actions: {
    createDatabase() {
      this.get('flashMessages').clearMessages();

      let newDb = this.controller.get('newDb');

      // validate the input
      if (!this.validateCreateDatabaseFormValid(newDb)) {
        return;
      }

      storage.get(databaseFilePath).then((databases) => {
        databases.pushObject({
          name: newDb.name,
          type: newDb.type.id,
          host: newDb.host,
          databaes: newDb.database,
          username: newDb.username,
          password: newDb.password,
          port: newDb.port
        });

        storage.set(databaseFilePath, databases).then(() => {
          this.get('flashMessages').success('Created database');
            this.controller.set('newDb', {});
            this.refresh();
            this.controller.toggleProperty('showCreateDatabase');
          }).catch((error) => {
            console.error(error);
            this.get('flashMessages').danger('error');
          });
        });
    },

    connectToDatabase(database) {
      console.log(JSON.stringify(database));
    },

    toggleShowDeleteConfirm(database) {
      this.set('currentDatabase', database);
      this.controller.toggleProperty('showDeleteConfirmation');
    },

    deleteDatabase() {
      storage.get(databaseFilePath).then((databases) => {
        console.log(JSON.stringify(databases));
        for(let i = 0; i < databases.length; i++) {
          if (databases[i].name === this.get('currentDatabase.name')) {
            databases.splice(i, 1);
          }
        }
        console.log(JSON.stringify(databases));

        storage.set(databaseFilePath, databases).then(() => {
          this.refresh();
          this.controller.toggleProperty('showDeleteConfirmation');
        }).catch((error) => {
          console.error(error);
          this.get('flashMessages').danger('error');
        });
      });
    }
  }
});

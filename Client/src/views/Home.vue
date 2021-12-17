<template>
  <div class="main-block">
    <div>
      <div class="elements">
      <textarea type="text"
                @keyup.enter="addNote"
                v-model="newNote.body"
                placeholder="Введите заметку"
      >
      </textarea>
        <!--      <input type="text" @keyup.enter="addNote" v-model="newNote.body" placeholder="Введите заметку">-->
        <button @click="addNote" class="btn btn-add">Добавить заметку</button>
      </div>
      <div class="container">
        <div class="note-card" v-for="note in notes" :key="note.id">
          <div class="card-header">
            <div class="card-header__title">{{
                format(new Date(note.dateCreation), 'eeee', {locale: dateLocale})
              }}
            </div>
            <div class="card-header__subtitle">
              {{ format(new Date(note.dateCreation), 'd MMMM, yyyy', {locale: dateLocale}) }}
            </div>
          </div>
          <div class="card-body">
            <textarea type="text" :disabled="!note.isEditable" v-model="note.body" class="body-text"></textarea>
            <div class="card-button">
              <input type="checkbox" :checked="note.status" v-model="note.status" @change="updateNote(note)">
              <button v-if="!note.isEditable" @click="note.isEditable=true" class="btn btn-edit">Редактировать</button>
              <button v-else @click="updateNote(note)" class="btn btn-save">Сохранить</button>
              <button @click="removeNote(note.id)" class="btn btn-delete">Удалить</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import {format} from 'date-fns';
import {ru} from 'date-fns/locale';
import Swal from 'sweetalert2';
import {checkToken} from '@/core/helpers/checkToken';

export default {
  name: 'Home',

  components: {},

  data() {
    return {
      notes: null,
      inputText: '154885',
      dateLocale: ru,
      newNote: {
        body: '',
      },
    };
  },

  computed: {},

  watch: {},

  created() {
  },

  async mounted() {

    const myHeaders = new Headers();
    myHeaders.append('Authorization', `Bearer ${localStorage.getItem('token')}`);

    const requestOptions = {
      method: 'GET',
      headers: myHeaders,
      redirect: 'follow',
    };

    fetch(`${process.env.VUE_APP_ROOT_API}/notes`, requestOptions)
        .then(response => response.text())
        .then(response => {
          const notes = JSON.parse(response);
          this.notes = notes.map(note => {
            note.isEditable = false;
            return note;
          });
        })
        .catch(error => console.log('error', error));

  },

  methods: {
    format,
    async removeNote(id) {
      const myHeaders = new Headers();
      myHeaders.append('Authorization', `Bearer ${localStorage.getItem('token')}`);

      const requestOptions = {
        method: 'DELETE',
        headers: myHeaders,
        redirect: 'follow',
      };

      await checkToken();
      fetch(`http://localhost:5000/notes/${id}`, requestOptions)
          .then(response => response.text())
          .then(response => {
            const notes = JSON.parse(response);
            this.notes = notes.map(note => {
              note.isEditable = false;
              return note;
            });
            Swal.fire({
              position: 'top-end',
              icon: 'success',
              title: 'Заметка удалена',
              showConfirmButton: false,
              timer: 1000,
            });
          })
          .catch(error => {
            console.log('error', error);
            Swal.fire({
              icon: 'error',
              title: 'Ошибка',
              text: 'Поробуйте еще раз',
            });
          });

    },
    async addNote() {
      if (this.newNote.body) {
        const myHeaders = new Headers();
        myHeaders.append('Content-Type', 'application/json');
        const raw = JSON.stringify(this.newNote);
        myHeaders.append('Authorization', `Bearer ${localStorage.getItem('token')}`);
        const requestOptions = {
          method: 'POST',
          headers: myHeaders,
          body: raw,
          redirect: 'follow',
        };

        await checkToken();
        fetch('http://localhost:5000/notes', requestOptions)
            .then(response => response.text())
            .then(response => {
              const notes = JSON.parse(response);
              this.notes = notes.map(note => {
                note.isEditable = false;
                return note;
              });
            })
            .catch(error => console.log('error', error));
        this.newNote.body = '';
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Ошибка',
          text: 'Введите заметку',
        });
      }
    },
    async updateNote(modifiedNote) {
      if (modifiedNote.body) {
        const myHeaders = new Headers();
        myHeaders.append('Content-Type', 'application/json');
        myHeaders.append('Authorization', `Bearer ${localStorage.getItem('token')}`);
        const raw = JSON.stringify(modifiedNote);
        const requestOptions = {
          method: 'PUT',
          headers: myHeaders,
          body: raw,
          redirect: 'follow',
        };
        await checkToken();
        fetch('http://localhost:5000/notes', requestOptions)
            .then(response => response.text())
            .then(response => {
              const notes = JSON.parse(response);
              this.notes = notes.map(note => {
                note.isEditable = false;
                return note;
              });
              Swal.fire({
                position: 'top-end',
                icon: 'success',
                title: 'Заметка успешно отредактирована',
                showConfirmButton: false,
                timer: 1000,
              });
            })
            .catch(error => console.log('error', error));
        modifiedNote.isEditable = false;
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Ошибка',
          text: 'Введите заметку',
        });
      }
    },
  },
};

</script>

<style lang="scss" scoped>
.main-block {
  display: flex;
  justify-content: center;
  margin: 0;
  background-color: #f7f8fc;
  font-family: "Roboto", sans-serif;
  color: #10182f;
  height: 100vh;
}

.container {
  display: flex;
  justify-content: space-evenly;
  flex-wrap: wrap;
}

.note-card {
  margin: 10px;
  background-color: #fff;
  border-radius: 10px;
  box-shadow: 0 2px 20px rgba(0, 0, 0, 0.2);
  overflow: hidden;
  width: 300px;
}

.card-body {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
  padding: 20px;
  min-height: 150px;
}

.card-header {
  padding: 20px 0;
  margin: 0 30px;
  border-bottom: 1px solid rgba(100, 58, 122, .5);
}

.card-header__title {
  font-family: 'Pacifico', cursive;
  font-weight: 500;
  text-align: center;
  font-size: 30px;
  color: rgba(100, 58, 122, .8);
}

.card-header__subtitle {
  font-size: 15px;
  text-align: center;
  letter-spacing: .5px;
  font-family: "zilla slab", serif
}

.btn {
  box-sizing: border-box;
  color: #FFFFFF;
  cursor: pointer;
  font-family: Inter, Helvetica, "Apple Color Emoji", "Segoe UI Emoji", NotoColorEmoji, "Noto Color Emoji", "Segoe UI Symbol", "Android Emoji", EmojiSymbols, -apple-system, system-ui, "Segoe UI", Roboto, "Helvetica Neue", "Noto Sans", sans-serif;
  font-size: 16px;
  font-weight: 500;
  line-height: 24px;
  opacity: 1;
  outline: 0 solid transparent;
  padding: 8px 18px;
  user-select: none;
  -webkit-user-select: none;
  touch-action: manipulation;
  width: fit-content;
  word-break: break-word;
  border: 0;
  margin-bottom: 20px;
}

.btn-edit {
  background: rgba(223, 241, 31, 0.75);
  border-radius: 999px;
  box-shadow: rgba(223, 241, 31, 0.75) 0 10px 20px -10px;
}

.btn-save {
  background: rgba(66, 199, 17, 0.75);
  border-radius: 999px;
  box-shadow: rgba(66, 199, 17, 0.75) 0 10px 20px -10px;
}

.btn-add {
  background: rgba(50, 199, 17, 0.75);
  border-radius: 999px;
  box-shadow: rgba(66, 199, 17, 0.75) 0 10px 20px -10px;
  margin: 0 !important;
}

.btn-delete {
  background: rgba(229, 54, 24, 0.75);
  border-radius: 999px;
  box-shadow: rgba(229, 54, 24, 0.75) 0 10px 20px -10px;
}

.card-button {
  display: flex;
  flex-direction: column;
}

.body-text {
  background-color: transparent;
  border-radius: 0;
  border: none;
  overflow: auto;
  outline: none;
  width: 100%;
  height: 120px;
}

.elements {
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>

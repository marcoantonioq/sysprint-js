<template>
  <div>
    <div class="v-row">
      <v-form ref="form" lazy-validation>
        <v-file-input
          class="file"
          v-model="form.files"
          @change="onFileChange"
          placeholder="Enviar seus documentos"
          label="Arquivo (PDF)"
          multiple
          prepend-icon="mdi-paperclip"
        >
          <template v-slot:selection="{ text }">
            <v-chip small label color="primary">
              {{ text }}
            </v-chip>
          </template>
        </v-file-input>

        <div v-show="form.files.length > 0">
          <v-tooltip top>
            <template v-slot:activator="{ on, attrs }">
              <div class="d-flex justify-space-around flex-wrap printers">
                <a
                  class="d-flex flex-column align-content-center text-center"
                  v-for="(el, i) in printers"
                  @click="toggle(el)"
                  :key="i"
                  v-bind="attrs"
                  v-on="on"
                >
                  <div>
                    <img :src="el.icon" alt="" /><br />
                    <v-icon
                      v-if="el.selected"
                      class="check"
                      color="green darken-2"
                    >
                      mdi-check-bold
                    </v-icon>
                    <div class="subtitle">{{ el.name }}&nbsp;&nbsp;&nbsp;</div>
                  </div>
                </a>
              </div>
            </template>
            <span>Selecionar impressora</span>
          </v-tooltip>

          <div class="d-flex justify-center flex-wrap">
            <v-btn
              class="mr-5"
              :loading="sending"
              :disabled="sending || countPrinterSelected < 1"
              color="success"
              @click="sending = true"
            >
              Imprimir
              <template v-slot:loader>
                <span>Enviando...</span>
              </template>
            </v-btn>

            <v-btn elevation="1" @click="details = !details"
              >Configurações</v-btn
            >
          </div>
          <div v-show="details">
            <v-text-field
              v-model="form.copies"
              type="number"
              label="Cópias"
              prepend-icon="mdi-content-copy"
            />
            <v-text-field
              v-model="form.pages"
              label="Páginas (ex: 1-5 ou 2,4)"
              prepend-icon="mdi-arrange-bring-forward"
            />
            <v-select
              v-model="form.double_sided"
              :items="list.double_sided"
              label="Frente/Verso"
              prepend-icon="mdi-format-page-split"
            ></v-select>
            <v-select
              v-model="form.page_set"
              :items="list.page_set"
              label="Folhas"
              prepend-icon="mdi-book-open-page-variant"
            ></v-select>
            <v-select
              v-model="form.media"
              :items="list.media"
              label="Papel"
              prepend-icon="mdi-resize"
            ></v-select>
            <v-select
              v-model="form.orientation"
              :items="list.orientation"
              label="Orienthis.$axiostação"
              prepend-icon="mdi-flip-vertical"
            ></v-select>
          </div>
        </div>
      </v-form>
      {{ printers }}
    </div>
    <button @click="reloadPrinters()">Reload</button>
  </div>
</template>

<script>
import { required, minLength } from '@vuelidate/validators';
import { mapGetters, mapActions } from 'vuex';

export default {
  name: 'Printers',
  validations: {
    form: {
      copies: { required, minLength: minLength(1) },
    },
  },
  data: () => ({
    form: {
      files: [],
      copies: 1,
      pages: '',
      double_sided: '',
      page_set: '',
      media: 'A4',
      orientation: 'Retrato',
    },
    list: {
      double_sided: [
        '',
        'Sim - Virar na borda(retrato)', // two-sided-long-edge
        'Sim - Virar na borda(paisagem)', // wo-sided-short-edge
      ],
      page_set: ['', 'Folhas pares', 'Folhas impares'],
      media: ['A4', 'A3'],
      orientation: ['Retrato', 'Paisagem'],
    },
    sending: false,
    details: false,
  }),
  methods: {
    ...mapActions(['update', 'remove', 'toggle']),
    onFileChange(files) {
      this.form.files = files.filter((file) =>
        this.$store.state.FILES_FORMATS.includes(file.type)
      );
    },
    printHello() {
      this.$hello('There');
    },
    async reloadPrinters() {
      let data = await this.$printers.getPrinters();
      console.log(data);
    },
  },
  watch: {
    details() {
      console.log(this.details);
    },
    sending() {
      if (this.sending) {
        console.log('Imprimindo!!!');
        setTimeout(() => {
          this.sending = false;
        }, 5000);
      } else {
        console.log('Impresso!!!');
      }
    },
  },
  computed: {
    ...mapGetters(['printers']),
    countPrinterSelected: function () {
      return this.printers.reduce((ac, pr) => {
        if (pr.selected) ac++;
        return ac;
      }, 0);
    },
  },
  asyncData({ $printers, $logging }) {
    console.log('ASDSA:', $printers);
    // let data = await $printers.getPrinters();
    // $logging.log('Dados recebidos::: ', data);
    // console.log('Teste::', data, $logging);
    return [];
  },
  created() {
    this.$logging.log('Component created!');
  },
  mounted() {
    // this.$hello('Browser');
    // this.$store.dispatch('print', 'from mounted()');
  },
};
</script>

<style lang="scss" scoped>
img {
  width: 90px;
}

.file {
  padding: 1.5rem;
}

.printers {
  padding-bottom: 0.8rem;
  a {
    padding: 10px;
    color: #000;

    .v-icon {
      font-size: 60px;
    }
    .check {
      position: absolute;
      top: 112px;
    }
    .subtitle {
      position: relative;
      top: -15px;
    }
  }
}
</style>
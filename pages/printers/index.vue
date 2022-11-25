
<template>
  <v-form
    ref="form"
    action="/api/print"
    method="post"
    enctype="multipart/form-data"
  >
    <v-file-input
      v-model="form.files"
      class="file"
      placeholder="Enviar seus documentos"
      label="Arquivo (PDF)"
      multiple
      prepend-icon="mdi-paperclip"
    >
      <template #selection="{ text }">
        <v-chip small label color="primary">
          {{ text }}
        </v-chip>
      </template>
    </v-file-input>

    <v-tooltip top>
      <template #activator="{ on, attrs }">
        <div class="d-flex justify-space-around flex-wrap printers">
          <a
            v-for="(el, i) in printers"
            :key="i"
            class="d-flex flex-column align-content-center text-center"
            v-bind="attrs"
            @click="toggle(el)"
            v-on="on"
          >
            <div class="icon">
              <img :src="el.icon" alt="" /><br />
              <v-icon v-if="el.selected" class="check" color="green darken-2">
                mdi-check-bold
              </v-icon>
            </div>
            <div class="subtitle">{{ el.name }}&nbsp;&nbsp;&nbsp;</div>
          </a>
        </div>
      </template>
      <span>Selecionar impressora</span>
    </v-tooltip>

    <div class="d-flex justify-center flex-wrap">
      <v-btn
        class="mr-5"
        :loading="sending"
        :disabled="sending || countPrinterSelected < 1 || form.files.length < 1"
        color="success"
        @click="sending = true"
      >
        Imprimir
        <template #loader>
          <span>Enviando...</span>
        </template>
      </v-btn>
    </div>
    <div v-show="countPrinterSelected > 0">
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
        label="Orientação"
        prepend-icon="mdi-flip-vertical"
      ></v-select>
    </div>
  </v-form>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';

export default {
  name: 'PrintersIndex',
  middleware: 'protected',
  data: () => ({
    form: {
      user: 'user',
      files: [],
      copies: 1,
      pages: '',
      double_sided: '',
      page_set: '',
      media: 'A4',
      orientation: '',
    },
    list: {
      double_sided: [
        '',
        'Sim - Virar na borda(retrato)', // two-sided-long-edge
        'Sim - Virar na borda(paisagem)', // wo-sided-short-edge
      ],
      page_set: ['', 'Folhas pares', 'Folhas impares'],
      media: ['A4', 'A3'],
      orientation: ['', 'Retrato', 'Paisagem'],
    },
    sending: false,
  }),
  computed: {
    ...mapGetters(['printers']),
    countPrinterSelected() {
      return this.printers?.reduce((ac, pr) => {
        if (pr.selected) ac++;
        return ac;
      }, 0);
    },
  },
  watch: {
    'form.files'(val, old) {
      // eslint-disable-next-line no-console
      console.log(`New Val: ${JSON.stringify(val.length)}`);
    },
    sending() {
      if (this.sending) {
        let form = {
          ...this.form,
          printers: this.printers
            ?.filter((pr) => pr.selected)
            ?.map((el) => el.name)
            ?.join(','),
        };
        if (form.double_sided)
          form.double_sided =
            form.double_sided === 'Sim - Virar na borda(paisagem)'
              ? 'two-sided-short-edge'
              : 'two-sided-long-edge';
        if (form.orientation)
          form.orientation = form.orientation === 'Paisagem' ? '4' : '3';
        form = this.$formData.jsonToFormData(form);
        this.$store.dispatch('print', form).then((res) => {
          this.sending = false;
        });
        this.form = {
          user: 'user',
          files: [],
          copies: 1,
          pages: '',
          double_sided: '',
          page_set: '',
          media: 'A4',
          orientation: '',
        };
      }
    },
  },
  mounted() {
    this.reloadPrinters();
  },
  methods: {
    ...mapActions(['update', 'remove', 'toggle']),
    onFileChange(files) {
      this.form.files = files.filter((file) =>
        this.$store.state.FILES_FORMATS.includes(file.type)
      );
    },
    async reloadPrinters() {
      await this.$store.dispatch('update');
    },
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

    .icon {
      position: relative;
    }

    .v-icon {
      font-size: 60px;
    }
    .check {
      position: absolute;
      top: 0px;
      right: 18px;
    }
    .subtitle {
      top: -15px;
      max-width: 150px;
    }
  }
}
</style>
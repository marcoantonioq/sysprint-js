import { mapGetters, mapActions } from 'vuex';

export default {
  data: () => ({
    form: {
      user: 'user',
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
    details() {},
    sending() {
      if (this.sending) {
        const form = this.$formData.jsonToFormData(this.form);
        this.$store.dispatch('print', form);
        this.sending = false;
      } else {
        // eslint-disable-next-line no-console
        console.log('Impresso!!!');
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
    printHello() {
      this.$hello('There');
    },
    async reloadPrinters() {
      await this.$store.dispatch('update');
    },
  },
};

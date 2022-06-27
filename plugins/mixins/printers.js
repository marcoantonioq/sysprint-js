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

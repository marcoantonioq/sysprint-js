export class PrintersService {
  constructor($axios) {
    this.$axios = $axios;
  }

  async getPrinters() {
    $axios
      .get('Dados', 'http://localhost:631/printers')
      .then((res) => console.log(res));
    return await this.$axios.get('http://localhost:631/printers');
  }
}

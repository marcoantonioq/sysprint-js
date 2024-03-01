<template>
  <UploadFiles :files="files" @update="handleFilesUpdate" />
  {{ files }}
</template>

<script name="ComponentPrint" lang="ts" setup>
import { ref } from "vue";
import UploadFiles from "@/components/UploadFiles.vue";

const files = ref<File[]>([]);

// import { mapState, mapActions, mapMutations } from "vuex";

// const form = {
//   user: "user",
//   files: [] as File[],
//   copies: 1,
//   pages: "",
//   double_sided: "",
//   page_set: "",
//   media: "A4",
//   orientation: "",
// };
// const list = {
//   double_sided: [
//     "",
//     "Sim - Virar na borda(retrato)", // two-sided-long-edge
//     "Sim - Virar na borda(paisagem)", // wo-sided-short-edge
//   ],
//   page_set: ["", "Folhas pares", "Folhas impares"],
//   media: ["A4", "A3"],
//   orientation: ["", "Retrato", "Paisagem"],
// };
// const sending = false;
// ...mapState(["printers", "info", "errors"]),
// function selectedFiles() {
//   return this.form.files.length;
// }
// function selectedPrinter() {
//   return this.printers?.reduce((ac, pr) => {
//     if (pr.selected) ac++;
//     return ac;
//   }, 0);
// }

// function sendingData() {
//   if (this.sending) {
//     let form = {
//       ...this.form,
//       path: this.printers?.find((pr) => pr.selected).path,
//       printers: this.printers
//         ?.filter((pr) => pr.selected)
//         ?.map((el) => el.name)
//         ?.join(","),
//     };
//     if (form.double_sided) {
//       form.double_sided =
//         form.double_sided === "Sim - Virar na borda(paisagem)"
//           ? "two-sided-short-edge"
//           : "two-sided-long-edge";
//     }
//     if (form.orientation) {
//       form.orientation = form.orientation === "Paisagem" ? "4" : "3";
//     }
//     form = this.$formData.jsonToFormData(form);
//   }
// }
// // ...mapMutations(["remove", "togglePrinters"]),
// // ...mapActions(["reloadPrinters"]),
// function submitForm(event: Event) {
//   event.preventDefault();
// }
function handleFilesUpdate(updated: File[]) {
  console.log("Arquivos atualizados no componente pai:", updated);
  files.value = updated;
}
</script>

<style lang="scss" scoped></style>

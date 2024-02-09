<template>
  <div ref="thisElement" class="printer">
    <img ref="elIconPrint" :src="printerImage" alt="" draggable="false" />
    <span class="printer-name">{{ props.printer.name }}</span>
    <div :id="`modal-${props.printer.name}`" class="modal modal-fixed-footer">
      <div class="modal-content">
        <div class="upload s12" ref="elUploadFile">
          <div v-if="spool.files.length">
            <b>
              {{ spool.files.length }} arquivos para imprimir em
              {{ props.printer.name }}
            </b>
            <br />
            <span v-for="file in spool.files" :key="file.name">
              {{ file.name }}<br />
            </span>
          </div>
          <div v-else>Selecionar arquivo PDF</div>
        </div>
        <input
          class="hide"
          ref="elFileInput"
          type="file"
          accept=".pdf"
          multiple
        />
        <div class="row">
          <div class="input-field col s12 m4">
            <input
              id="copias"
              type="number"
              v-model="spool.copies"
              class="validate"
            />
            <label for="copias">Cópias</label>
          </div>
          <div class="input-field col s12 m4">
            <input
              id="range"
              type="text"
              v-model="spool.range"
              @change="spool.range = spool.range.replace(/[^0-9,-]/gi, '')"
              class="validate"
            />
            <label for="range">Páginas (ex: 1-5 ou 2,4)</label>
          </div>
          <div class="input-field col s12 m4">
            <select v-model="spool.sided">
              <option value="one-sided">Não</option>
              <option value="two-sided-long-edge" selected>
                Sim - Virar na borda (retrato)
              </option>
              <option value="wo-sided-short-edge">
                Sim - Virar na borda (paisagem)
              </option>
            </select>
            <label>Frente/Verso</label>
          </div>
          <div class="input-field col s12 m4">
            <select v-model="spool.pages">
              <option value="all" disabled selected>Todas</option>
              <option value="even">Folhas pares</option>
              <option value="odd">Folhas impares</option>
            </select>
            <label>Folhas</label>
          </div>
          <div class="input-field col s12 m4">
            <select v-model="spool.orientation">
              <option value="" selected></option>
              <option value="4">Paisagem (-90°)</option>
              <option value="5">Paisagem (90°)</option>
              <option value="6">Retrato (180°)</option>
            </select>
            <label>Orientação</label>
          </div>
          <div class="input-field col s12 m4">
            <select v-model="spool.quality">
              <option value="3">Rascunho</option>
              <option value="4">Normal</option>
              <option value="5">Melhor</option>
            </select>
            <label>Qualidade</label>
          </div>
          <div class="input-field col s12 m4">
            <select v-model="spool.media">
              <option value="" select>Automático</option>
              <option value="A4" select>A4</option>
              <option value="A3" select>A3</option>
            </select>
            <label>Tamanho</label>
          </div>
        </div>
      </div>
      <div class="modal-footer">
        <a
          v-show="spool.files.length > 0"
          class="modal-close white-text green darken-4 btn-flat"
          @click="submit()"
        >
          <b>Imprimir</b>
        </a>
        <a
          style="margin-left: 10px"
          @click="clear()"
          href="#!"
          class="modal-close btn-flat"
          >Cancelar</a
        >
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, reactive, computed } from "vue";
import M from "materialize-css";
import { Printer, DataPrinter, Spool } from "@/store";

const props = defineProps<{ printer: Printer }>();

const emit = defineEmits<{
  (e: "send", response: DataPrinter): void;
}>();

const elFileInput = ref<HTMLInputElement | null>(null);
const elIconPrint = ref<HTMLElement | null>(null);
const elUploadFile = ref<HTMLElement | null>(null);
const thisElement = ref<HTMLElement | null>(null);
const spool = reactive<Spool>({
  id: 0,
  user: "user",
  printer: props.printer.name,
  files: [] as File[],
  copies: 1,
  range: "",
  sided: "two-sided-long-edge",
  pages: "all",
  media: "",
  quality: "4",
  orientation: "",
  status: "",
  title: "",
  msgs: [],
});

const submit = () => {
  console.log("Dados para enviar: ", spool);
  emit("send", { spool, printer: props.printer });
  clear();
};

const clear = () => {
  spool.files = [];
  spool.range = "";
};

const printerImage = computed(() => {
  return props.printer.status === "online" ? "img/print.png" : "img/print.png";
});

onMounted(() => {
  const body = document.body;
  const elModal = document.querySelector(
    `#modal-${props.printer.name}`
  ) as Element;
  const modal = M.Modal.init(elModal, {});
  M.updateTextFields();
  M.FormSelect.init(document.querySelectorAll("select"));

  elFileInput.value?.addEventListener("change", () => {
    if (elFileInput.value?.files) {
      clear();
      spool.files = Array.from(elFileInput.value.files).filter((file) =>
        ["application/pdf", "text/plain"].includes(file.type)
      );
      elFileInput.value.value = "";
    }
  });

  elIconPrint.value?.addEventListener("click", (event: MouseEvent) => {
    if (elFileInput.value) elFileInput.value.value = "";
    modal.open();
    if (spool.files && spool.files?.length === 0) {
      elFileInput.value?.click();
    }
    event.preventDefault();
    event.stopPropagation();
  });

  elIconPrint.value?.addEventListener("contextmenu", (event: MouseEvent) => {
    modal.open();
    event.preventDefault();
    event.stopPropagation();
  });

  elUploadFile.value?.addEventListener("click", (event: MouseEvent) => {
    elFileInput.value?.click();
    event.stopPropagation();
  });

  body.addEventListener("dragover", (event: DragEvent) => {
    thisElement.value?.classList.add("drag-page");
    event.preventDefault();
  });
  body.addEventListener("dragenter", (event: DragEvent) => {
    thisElement.value?.classList.add("drag-page");
    event.preventDefault();
  });
  body.addEventListener("dragleave", (event: DragEvent) => {
    thisElement.value?.classList.remove("drag-page");
    event.preventDefault();
  });
  body.addEventListener("drop", (event: DragEvent) => {
    thisElement.value?.classList.remove("drag-page");
    event.preventDefault();
  });

  thisElement.value?.addEventListener("drop", (event: DragEvent) => {
    thisElement.value?.classList.remove("drag-over");
    clear();
    if (event.dataTransfer) {
      console.log(
        "Arquivos enviados::::",
        props.printer.name,
        event.dataTransfer.files
      );
      const fileList = event.dataTransfer.files;

      for (let i = 0; i < fileList.length; i++) {
        const file = fileList[i];
        if (file.type === "application/pdf") {
          spool.files.push(file);
        }
      }
    }
    modal.open();
  });

  thisElement.value?.addEventListener("dragover", (event: DragEvent) => {
    thisElement.value?.classList.add("drag-over");
    event.preventDefault();
  });
  thisElement.value?.addEventListener("dragenter", (event: DragEvent) => {
    thisElement.value?.classList.add("drag-over");
    event.preventDefault();
  });
  thisElement.value?.addEventListener("dragleave", (event: DragEvent) => {
    thisElement.value?.classList.remove("drag-over");
    event.preventDefault();
  });
});
</script>

<style scoped lang="scss">
.drag-over {
  background-color: #d4ffd4;
  border: 1px solid green !important;
}

.drag-page {
  border: 1px dashed red !important;
}

.printer {
  flex: 1;
  margin: 5px;
  text-align: center;
  margin: 5px;
  display: flex;
  flex-direction: column;
  align-items: center;
  user-select: none;
  border: 1px solid transparent;
  img {
    max-width: 90px;
  }
  .printer-name {
    font-weight: bold;
  }
  .icon {
    opacity: 0.8;
    cursor: pointer;
  }
  .icon:hover {
    opacity: 1;
    border-radius: 10px;
  }
}

.upload:hover {
  background-color: #c5f1cb;
  border: 4px dashed #1f7e43;
}
.upload {
  background-color: #ececec;
  border-radius: 2px;
  border: 4px dashed #dddcdc;
  font-size: small;
  font-weight: bold;
  margin-bottom: 20px;
  padding: 10px;
}

.modal {
  top: 15px !important;
  width: 90%;
  min-height: 90%;
  max-height: 98%;
  max-width: 900px;
  .modal-content {
    padding: 10px;
  }
}
</style>

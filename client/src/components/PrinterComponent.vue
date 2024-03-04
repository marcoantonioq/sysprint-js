<template>
  <div ref="printerHTML" v-if="props.printer">
    <input
      class="hidden"
      type="file"
      accept=".pdf"
      multiple
      @change="handleFileChange"
    />
    <q-dialog v-model="dialog" position="top">
      <q-card class="card">
        <q-card-section>
          <div class="text-center q-mb-sm" style="color: #4b4b4b">
            <q-icon name="print" style="font-size: 20px; margin-right: 4px" />
            <b>
              {{ props.printer.name.toUpperCase().replace(/(_|-)/gi, ' ') }}</b
            >
          </div>
          <div class="row justify-center actions">
            <div class="text-center">
              <q-btn
                color="primary"
                size="md"
                @click="openFileInput"
                style="height: 77px"
                class="upload"
              >
                <q-icon left size="3em" name="picture_as_pdf" />
                <div>{{ data.label }}</div>
              </q-btn>
            </div>
            <div class="column">
              <q-btn
                color="green-9"
                label="Imprimir"
                @click="printer()"
                style="margin: 0 5px 5px"
                :disabled="data.files.length === 0"
              />
              <q-btn
                class="btn-cancel"
                color="red-8"
                label="Cancelar"
                @click="cancel"
                style="margin: 0 5px"
              />
            </div>
          </div>
          <q-input type="number" v-model="data.spool.copies" label="Cópias" />
          <q-input
            id="range"
            type="text"
            v-model="data.spool.range"
            @change="
              data.spool.range = data.spool.range
                ?.replace(/[^0-9,-]/gi, '')
                .trim()
            "
            class="validate"
            label="Páginas (ex: 1-5 ou 2,4)"
          />
          <q-expansion-item>
            <template v-slot:header>
              <div class="justify-center header-options">Opções</div>
            </template>
            <div class="text-left">
              <div class="label">Frete e Verso:</div>
              <q-radio v-model="data.spool.sided" val="one-sided" label="Não" />
              <q-radio
                v-model="data.spool.sided"
                val="two-sided-long-edge"
                label="Retrato"
              />
              <q-radio
                v-model="data.spool.sided"
                val="wo-sided-short-edge"
                label="Paisagem"
              />
            </div>
            <hr />
            <div class="text-left">
              <div class="label">Folhas:</div>
              <q-radio v-model="data.spool.pages" val="all" label="Todas" />
              <q-radio
                v-model="data.spool.pages"
                val="even"
                label="Folhas pares"
              />
              <q-radio
                v-model="data.spool.pages"
                val="odd"
                label="Folhas impares"
              />
            </div>
            <hr />
            <div class="text-left">
              <div class="label">Orientação (graus):</div>
              <q-radio
                v-model="data.spool.orientation"
                :val="undefined"
                label="Padrão"
              ></q-radio>
              <q-radio
                v-model="data.spool.orientation"
                val="4"
                label="90°"
              ></q-radio>
              <q-radio
                v-model="data.spool.orientation"
                val="5"
                label="-90°"
              ></q-radio>
              <q-radio
                v-model="data.spool.orientation"
                val="6"
                label="180°"
              ></q-radio>
            </div>
            <hr />
            <div class="text-left">
              <div class="label">Qualidade:</div>
              <q-radio
                v-model="data.spool.quality"
                val="3"
                label="Rascunho"
              ></q-radio>
              <q-radio
                v-model="data.spool.quality"
                val="4"
                label="Normal"
              ></q-radio>
              <q-radio
                v-model="data.spool.quality"
                val="5"
                label="Melhor"
              ></q-radio>
            </div>

            <hr />
            <div class="text-left">
              <div class="label">Tamanho:</div>
              <q-radio
                v-model="data.spool.media"
                :val="undefined"
                label="Automático"
              ></q-radio>
              <q-radio v-model="data.spool.media" val="A4" label="A4"></q-radio>
              <q-radio v-model="data.spool.media" val="A3" label="A3"></q-radio>
            </div>
          </q-expansion-item>
        </q-card-section>
      </q-card>
    </q-dialog>
  </div>
</template>

<script setup lang="ts">
import { Printer, Spool } from 'src/app';
import { sendPrint } from 'src/boot/socket';
import { ref, reactive, computed, watch } from 'vue';

const printerHTML = ref(null as HTMLInputElement | null);
const props = defineProps<{ printer: Printer | null }>();
const dialog = computed(() => !!props.printer);

const emit = defineEmits<{
  send: [jobs: Spool[]];
  cancel: [printer: Printer | null];
}>();

const SPOOL = <Spool>{
  id: 0,
  user: 'user',
  print: props.printer?.name || '',
  copies: 1,
  printed: 0,
  range: ' ',
  sided: 'two-sided-long-edge',
  pages: 'all',
  media: undefined,
  quality: '4',
  orientation: undefined,
  title: '',
  msgs: [],
  errors: [],
};

const data = reactive({
  label: 'SELECIONAR ARQUIVO PDF',
  spool: { ...SPOOL },
  files: [] as File[],
});

const printer = () => {
  if (!props.printer) return;
  if (props.printer) {
    const jobs = data.files.map((file) => {
      const job = JSON.parse(JSON.stringify(data.spool)) as Spool;
      job.print = props.printer?.name || '';
      job.status = 'send';
      job.title = file.name;
      job.buffer = file;
      return job;
    });
    emit('send', jobs);
    sendPrint(jobs, (jobs: Spool[]) => {
      console.log('Retornado :', jobs);
    });
    clear();
    cancel();
  }
};

const cancel = () => {
  emit('cancel', null);
};

const clear = () => {
  data.label = 'SELECIONAR ARQUIVO PDF';
  data.spool = { ...SPOOL };
  data.files = [];
};
watch(() => props.printer, clear);

const openFileInput = () => {
  const fileInput = printerHTML.value?.querySelector(
    'input[type="file"]'
  ) as HTMLInputElement;
  if (fileInput) {
    fileInput.click();
  }
};

const handleFileChange = (event: Event) => {
  const target = event.target as HTMLInputElement;
  if (target.files) {
    data.files = Array.from(target.files);
    data.label = `${data.files?.length} arquivos selecionados`;
  }
};
</script>

<style lang="scss" scoped>
hr {
  border-top: 0.1px solid #0000002d;
}
.label {
  color: #000000b0;
  font-size: small;
  margin-bottom: -10px;
}

.card {
  min-width: 420px;
  .actions {
    margin-bottom: 15px;
  }
  .upload {
    width: 280px;
  }
}

.header-options {
  margin: 5px 0px 0px 140px;
  color: #0000009a;
}

@media screen and (max-width: 425px) {
  .card {
    min-width: 180px !important;

    .upload {
      margin-bottom: 15px;
    }

    .btn-cancel {
      margin-top: 10px !important;
    }
  }
}
</style>

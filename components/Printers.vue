<template>
  <div>
    <div class="v-row">
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
          @change="onFileChange"
        >
          <template #selection="{ text }">
            <v-chip small label color="primary">
              {{ text }}
            </v-chip>
          </template>
        </v-file-input>

        <div v-show="form.files.length > 0">
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
              <template #loader>
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
    </div>
    <button @click="reloadPrinters()">Reload</button>
  </div>
</template>

<script>
import printers from '~/plugins/printers.mixins';

export default {
  name: 'ComponentePrinters',
  mixins: [printers],
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
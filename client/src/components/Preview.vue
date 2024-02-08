<template>
  <div class="file-field input-field">
    <div class="btn">
      <span> <i class="fas fa-plus"></i></span>
      <input
        ref="fileInput"
        type="file"
        accept=".pdf"
        multiple
        @change="handleFileInputChange"
      />
    </div>
    <div class="file-path-wrapper">
      <input class="file-path validate" type="text" />
    </div>
  </div>
  <div class="col flex-container">
    <template v-if="uploadedFiles.length > 0">
      <template v-for="file in uploadedFiles" :key="file.name">
        <div class="card flex-item" style="width: 198px; height: 244px">
          <a @click="previewPDF(file)">
            <i class="fas fa-file-pdf"></i>
            {{ `${file.name}; ` }}
          </a>
        </div>
      </template>
    </template>
  </div>
  <div v-if="showPreview">
    <embed
      :src="previewURL || ''"
      type="application/pdf"
      width="100%"
      height="600px"
    />
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted } from "vue";

const fileInput = ref<HTMLInputElement | null>(null);
const uploadedFiles = ref<File[]>([]);
const showPreview = ref(false);
const previewURL = ref<string | null>(null);

const handleFileInputChange = () => {
  const fileList = fileInput.value?.files;

  if (fileList) {
    uploadedFiles.value = Array.from(fileList).filter((file) =>
      ["application/pdf", "text/plain"].includes(file.type)
    );
    console.log("arquivos:::", uploadedFiles.value);
    showPreview.value = false; // Reset preview when new files are selected
    previewURL.value = null;
  }
};

const previewPDF = (file: File) => {
  const fileURL = URL.createObjectURL(file);
  showPreview.value = true;
  previewURL.value = fileURL;
};

// Automatically scroll to the preview section when it becomes visible
onMounted(() => {
  if (showPreview.value) {
    const previewSection = document.getElementById("pdf-preview-section");
    if (previewSection) {
      previewSection.scrollIntoView({ behavior: "smooth" });
    }
  }
});
</script>

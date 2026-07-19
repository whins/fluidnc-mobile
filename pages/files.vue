<template>
  <div class="files-page">
    <!-- Job progress (visible when SD job is running) -->
    <JobProgress :current-file="runningFile" />

    <!-- Toolbar -->
    <div class="toolbar">
      <h2 class="page-title">{{ t("files.sdCard") }}</h2>
      <div class="toolbar-actions">
        <UButton
          icon="i-heroicons-arrow-path"
          size="sm"
          color="neutral"
          variant="ghost"
          :loading="loading"
          @click="loadFiles"
        />
        <UButton
          icon="i-heroicons-arrow-up-tray"
          size="sm"
          color="primary"
          variant="soft"
          @click="triggerUpload"
          :disabled="!connected"
        >
          {{ t("files.upload") }}
        </UButton>
        <!-- Hidden file input -->
        <input
          ref="fileInput"
          type="file"
          accept=".nc,.gcode,.gc,.gco,.ngc,.txt,.cnc,.tap"
          class="hidden-input"
          @change="handleFileSelected"
        />
      </div>
    </div>

    <!-- Upload progress -->
    <div v-if="uploading" class="upload-progress">
      <div class="upload-header">
        <UIcon name="i-heroicons-arrow-up-tray" class="upload-icon" />
        <span>{{ t("files.uploading") }} {{ uploadingName }}</span>
        <span class="upload-percent">{{ uploadPercent }}%</span>
      </div>
      <UProgress :value="uploadPercent" :max="100" color="primary" size="sm" />
    </div>

    <!-- Error -->
    <UAlert
      v-if="error"
      color="error"
      variant="soft"
      :title="error"
      icon="i-heroicons-exclamation-circle"
      :close-button="{
        icon: 'i-heroicons-x-mark',
        color: 'neutral',
        variant: 'ghost',
      }"
      @close="error = null"
    />

    <!-- File list -->
    <div v-if="!loading && files.length === 0" class="empty-state">
      <UIcon name="i-heroicons-folder-open" class="empty-icon" />
      <p>{{ t("files.noFiles") }}</p>
    </div>

    <div v-else class="file-list">
      <div
        v-for="file in files"
        :key="file.path"
        class="file-item"
        :class="{ 'file-item--running': runningFile === file.name }"
      >
        <div class="file-info">
          <UIcon name="i-heroicons-document-text" class="file-icon" />
          <div class="file-details">
            <span class="file-name">{{ file.name }}</span>
            <span class="file-size">{{ formatSize(file.size) }}</span>
          </div>
        </div>

        <div class="file-actions">
          <UButton
            icon="i-heroicons-play"
            size="sm"
            color="success"
            variant="soft"
            :disabled="!connected || isJobRunning"
            @click="startFile(file)"
          >
            {{ t("files.run") }}
          </UButton>
          <UButton
            icon="i-heroicons-trash"
            size="sm"
            color="error"
            variant="ghost"
            :disabled="!connected || isJobRunning"
            @click="confirmDelete(file)"
          />
        </div>
      </div>
    </div>

    <!-- Delete confirmation modal -->
    <UModal v-model:open="showDeleteModal">
      <template #content>
        <div class="modal-content">
          <UIcon
            name="i-heroicons-trash"
            class="modal-icon modal-icon--delete"
          />
          <p>{{ t("files.confirmDelete", { name: deleteTarget?.name }) }}</p>
          <div class="modal-actions">
            <UButton
              color="neutral"
              variant="outline"
              @click="showDeleteModal = false"
            >
              {{ t("files.cancel") }}
            </UButton>
            <UButton color="error" :loading="deleting" @click="doDelete">
              {{ t("files.confirm") }}
            </UButton>
          </div>
        </div>
      </template>
    </UModal>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref, watch } from "vue";
import type { SDFile } from "~/composables/useFluidNC";

definePageMeta({ layout: "default" });

const { t } = useI18n();
const { $fluidnc } = useNuxtApp();
const {
  listSDFiles,
  runSDFile,
  deleteSDFile,
  uploadSDFile,
  connected,
  status,
} = $fluidnc;

// ── State ──────────────────────────────────────────────────────────────────────
const files = ref<SDFile[]>([]);
const loading = ref(false);
const error = ref<string | null>(null);
const runningFile = ref<string | undefined>();

const uploading = ref(false);
const uploadPercent = ref(0);
const uploadingName = ref("");

const showDeleteModal = ref(false);
const deleteTarget = ref<SDFile | null>(null);
const deleting = ref(false);

const fileInput = ref<HTMLInputElement | null>(null);

const isJobRunning = computed(
  () => status.state === "Run" && status.sdPercent !== null,
);

// ── Load files ─────────────────────────────────────────────────────────────────
async function loadFiles() {
  if (!connected.value) return;
  loading.value = true;
  error.value = null;
  try {
    files.value = await listSDFiles();
  } catch (e: unknown) {
    error.value = e instanceof Error ? e.message : String(e);
  } finally {
    loading.value = false;
  }
}

// Auto-load on mount and when connection established
onMounted(loadFiles);
watch(
  () => connected.value,
  (val) => {
    if (val) loadFiles();
  },
);

// ── Upload ─────────────────────────────────────────────────────────────────────
function triggerUpload() {
  fileInput.value?.click();
}

async function handleFileSelected(e: Event) {
  const input = e.target as HTMLInputElement;
  const file = input.files?.[0];
  if (!file) return;

  uploading.value = true;
  uploadPercent.value = 0;
  uploadingName.value = file.name;

  try {
    await uploadSDFile(file, (pct) => {
      uploadPercent.value = pct;
    });
    await loadFiles();
  } catch (e: unknown) {
    error.value = e instanceof Error ? e.message : String(e);
  } finally {
    uploading.value = false;
    input.value = ""; // reset so same file can be re-uploaded
  }
}

// ── Run file ───────────────────────────────────────────────────────────────────
async function startFile(file: SDFile) {
  error.value = null;
  try {
    runningFile.value = file.name;
    await runSDFile(file.path);
  } catch (e: unknown) {
    error.value = e instanceof Error ? e.message : String(e);
    runningFile.value = undefined;
  }
}

// ── Delete ─────────────────────────────────────────────────────────────────────
function confirmDelete(file: SDFile) {
  deleteTarget.value = file;
  showDeleteModal.value = true;
}

async function doDelete() {
  if (!deleteTarget.value) return;
  deleting.value = true;
  try {
    await deleteSDFile(deleteTarget.value.path);
    files.value = files.value.filter(
      (f) => f.path !== deleteTarget.value!.path,
    );
    showDeleteModal.value = false;
  } catch (e: unknown) {
    error.value = e instanceof Error ? e.message : String(e);
  } finally {
    deleting.value = false;
  }
}

// ── Helpers ────────────────────────────────────────────────────────────────────
function formatSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} ${t("files.bytes")}`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
}
</script>

<style scoped>
.files-page {
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 14px;
  padding-bottom: 24px;
}

.toolbar {
  display: flex;
  align-items: center;
  gap: 10px;
}

.page-title {
  flex: 1;
  font-size: 16px;
  font-weight: 600;
}

.toolbar-actions {
  display: flex;
  gap: 6px;
  align-items: center;
}

.hidden-input {
  display: none;
}

.upload-progress {
  background: var(--ui-bg-elevated);
  border: 1px solid var(--ui-border);
  border-radius: 12px;
  padding: 12px 14px;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.upload-header {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 13px;
}

.upload-icon {
  width: 16px;
  height: 16px;
  color: var(--ui-color-primary-500);
}

.upload-percent {
  margin-left: auto;
  font-weight: 600;
  font-variant-numeric: tabular-nums;
}

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  padding: 40px 0;
  color: var(--ui-text-muted);
}

.empty-icon {
  width: 48px;
  height: 48px;
  opacity: 0.4;
}

.file-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.file-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  background: var(--ui-bg-elevated);
  border: 1px solid var(--ui-border);
  border-radius: 12px;
  padding: 12px 14px;
  transition: border-color 0.15s;
}

.file-item--running {
  border-color: var(--ui-color-success-500);
}

.file-info {
  display: flex;
  align-items: center;
  gap: 10px;
  min-width: 0;
}

.file-icon {
  width: 20px;
  height: 20px;
  color: var(--ui-text-muted);
  flex-shrink: 0;
}

.file-details {
  display: flex;
  flex-direction: column;
  min-width: 0;
}

.file-name {
  font-size: 14px;
  font-weight: 500;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.file-size {
  font-size: 11px;
  color: var(--ui-text-muted);
}

.file-actions {
  display: flex;
  gap: 6px;
  flex-shrink: 0;
}

.modal-content {
  padding: 24px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
  text-align: center;
}

.modal-icon {
  width: 40px;
  height: 40px;
}

.modal-icon--delete {
  color: var(--ui-color-error-500);
}

.modal-actions {
  display: flex;
  gap: 12px;
}
</style>

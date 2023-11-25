<template>
    <form :id="id" @submit.prevent="handleSubmit">
        <Card :unstyled="unstyled">
            <template #content>
                <slot></slot>

                <div class="text-center mt-3" v-if="!disabled">
                    <Button type="submit" icon="pi pi-check" :label="buttonText" :loading="loading"></Button>
                </div>
            </template>
        </Card>
    </form>
</template>

<script setup lang="ts">
import Card from 'primevue/card';
import Button from 'primevue/button';

const {buttonTitle, disabled, unstyled} = defineProps<{
    buttonTitle?: string,
    disabled?: boolean,
    unstyled?: boolean,
    loading?: boolean
}>();
const buttonText = buttonTitle ?? "Submit";

const emit = defineEmits(['submit']);

const id = crypto.randomUUID();

function handleSubmit(e: Event) {
    const form = document.getElementById(id) as HTMLFormElement;
    if(form.checkValidity()){
        emit('submit');
    }
}
</script>
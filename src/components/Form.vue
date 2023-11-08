<template>
    <form :id="id" @submit.prevent="handleSubmit">
        <Card>
            <template #content>
                <slot></slot>

                <div class="text-center mt-3">
                    <Button type="submit">{{buttonTitle}}</Button>
                </div>
            </template>
        </Card>
    </form>
</template>

<script setup lang="ts">
import Card from 'primevue/card';
import Button from 'primevue/button';

const props = defineProps<{
    buttonTitle?: string
}>();
const buttonTitle = props.buttonTitle ?? "Submit";

const emit = defineEmits(['submit']);

const id = crypto.randomUUID();

function handleSubmit(e: Event) {
    const form = document.getElementById(id) as HTMLFormElement;
    if(form.checkValidity()){
        emit('submit');
    }
}
</script>
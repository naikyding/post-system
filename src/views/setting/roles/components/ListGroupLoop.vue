<script setup>
import { computed, inject, ref } from 'vue'

defineProps({
  items: {
    type: Array,
  },
})

const role = inject('role')
</script>

<template>
  <v-list-group v-for="item in items" :value="item._id" :key="item._id">
    <template v-slot:activator="{ props }">
      <v-list-item v-bind="props">
        <template v-slot:prepend="{ isSelected, select }">
          <v-list-item-action start>
            <v-checkbox v-model="role.menusForm.value" hide-details :value="item._id">
              <template v-slot:label>
                <span>
                  {{ item.name }}
                </span>
                <v-chip color="error" variant="tonal" size="x-small"> Menu </v-chip>
              </template>
            </v-checkbox>
          </v-list-item-action>
        </template>
      </v-list-item>
    </template>

    <v-list-item v-for="operationsItem in item.operations" :key="operationsItem._id">
      <template v-slot:prepend="{ isSelected, select }">
        <v-list-item-action start>
          <v-checkbox v-model="role.operationsForm.value" hide-details :value="operationsItem._id">
            <template v-slot:label>
              <span>{{ operationsItem.name }}</span>
              <v-chip color="warning" variant="tonal" size="x-small"> Ops </v-chip>
            </template>
          </v-checkbox>
        </v-list-item-action>
      </template>
    </v-list-item>

    <template v-if="item?.children">
      <list-group-loop :items="item.children" />
    </template>
  </v-list-group>
</template>

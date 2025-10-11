<script setup>
defineProps({
  items: {
    type: Array,
  },
})
</script>

<template>
  <v-list-group v-for="item in items" :value="item._id" :key="item._id">
    <template v-slot:activator="{ props }">
      <v-list-item v-bind="props" :title="item.name">
        <template v-slot:prepend="{ isSelected, select }">
          <v-list-item-action start>
            <v-checkbox-btn></v-checkbox-btn>
          </v-list-item-action>
        </template>
      </v-list-item>
    </template>

    <v-list-item
      v-for="operationsItem in item.operations"
      :key="operationsItem._id"
      :title="operationsItem.name"
    >
      <template v-slot:prepend="{ isSelected, select }">
        <v-list-item-action start>
          <v-checkbox-btn></v-checkbox-btn>
        </v-list-item-action>
      </template>
    </v-list-item>

    <template v-if="item?.children">
      <list-group-loop :items="item.children" />
    </template>
  </v-list-group>
</template>

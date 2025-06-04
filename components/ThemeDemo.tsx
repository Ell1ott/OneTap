import React from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { ThemeToggle, ThemeInfo } from './ThemeToggle';

export function ThemeDemo() {
  return (
    <ScrollView className="flex-1 bg-background">
      <View className="space-y-4 p-4">
        <Text className="mb-4 text-2xl font-bold text-foreground">Dark Theme Demo</Text>

        {/* Theme Controls */}
        <View className="space-y-4">
          <Text className="text-lg font-semibold text-foreground">Theme Controls</Text>
          <ThemeToggle style="buttons" />
          <ThemeInfo />
        </View>

        {/* Color Palette */}
        <View className="space-y-4">
          <Text className="text-lg font-semibold text-foreground">Color Palette</Text>

          <View className="grid grid-cols-2 gap-4">
            <View className="rounded-lg bg-primary p-4">
              <Text className="font-medium text-background">Primary</Text>
            </View>

            <View className="rounded-lg bg-accent p-4">
              <Text className="font-medium text-background">Accent</Text>
            </View>

            <View className="bg-card border-border rounded-lg border p-4">
              <Text className="font-medium text-foreground">Card</Text>
            </View>

            <View className="bg-muted rounded-lg p-4">
              <Text className="text-mutedForeground font-medium">Muted</Text>
            </View>
          </View>
        </View>

        {/* UI Components */}
        <View className="space-y-4">
          <Text className="text-lg font-semibold text-foreground">UI Components</Text>

          {/* Buttons */}
          <View className="space-y-2">
            <TouchableOpacity className="rounded-lg bg-primary p-3">
              <Text className="text-center font-medium text-background">Primary Button</Text>
            </TouchableOpacity>

            <TouchableOpacity className="bg-card border-border rounded-lg border p-3">
              <Text className="text-center font-medium text-foreground">Secondary Button</Text>
            </TouchableOpacity>

            <TouchableOpacity className="bg-destructive rounded-lg p-3">
              <Text className="text-destructiveForeground text-center font-medium">
                Destructive Button
              </Text>
            </TouchableOpacity>
          </View>

          {/* Cards */}
          <View className="bg-card border-border space-y-3 rounded-lg border p-4">
            <Text className="text-lg font-semibold text-foreground">Card Title</Text>
            <Text className="text-foregroundMuted">
              This is a card component that automatically adapts to the current theme. The colors
              will change seamlessly when switching between light and dark modes.
            </Text>
            <View className="bg-muted rounded p-3">
              <Text className="text-mutedForeground text-sm">Muted content area</Text>
            </View>
          </View>

          {/* Form Elements */}
          <View className="space-y-3">
            <Text className="font-medium text-foreground">Form Elements</Text>
            <View className="bg-input border-border rounded-lg border p-3">
              <Text className="text-foreground">Input Field Placeholder</Text>
            </View>
            <View className="border-border rounded-lg border bg-middleground p-3">
              <Text className="text-foreground">Middleground Element</Text>
            </View>
          </View>
        </View>

        {/* Typography */}
        <View className="space-y-4">
          <Text className="text-lg font-semibold text-foreground">Typography</Text>
          <View className="space-y-2">
            <Text className="text-xl font-bold text-foreground">Heading Text</Text>
            <Text className="text-foreground">Regular body text</Text>
            <Text className="text-foregroundMuted">Muted body text</Text>
            <Text className="text-mutedForeground text-sm">Small muted text</Text>
          </View>
        </View>

        {/* Status Messages */}
        <View className="space-y-3">
          <Text className="text-lg font-semibold text-foreground">Status Messages</Text>

          <View className="rounded-lg border border-accent bg-accent/10 p-3">
            <Text className="font-medium text-accent">Info Message</Text>
            <Text className="text-foregroundMuted">This is an informational message.</Text>
          </View>

          <View className="bg-destructive/10 border-destructive rounded-lg border p-3">
            <Text className="text-destructive font-medium">Error Message</Text>
            <Text className="text-foregroundMuted">This is an error message.</Text>
          </View>
        </View>

        <View className="h-8" />
      </View>
    </ScrollView>
  );
}

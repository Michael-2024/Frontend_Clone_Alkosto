#!/bin/bash

# Script para probar fácilmente el cambio entre plantillas
# Uso: ./scripts/test-templates.sh [general|blackdays]

GREEN='\033[0;32m'
BLUE='\033[0;34m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

CONFIG_FILE="src/config/homeTemplates.js"

echo -e "${BLUE}╔════════════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║   Sistema de Plantillas - Cambio Rápido       ║${NC}"
echo -e "${BLUE}╚════════════════════════════════════════════════╝${NC}"
echo ""

# Función para cambiar plantilla
change_template() {
  local template=$1
  
  if [ "$template" == "general" ]; then
    sed -i "s/export const ACTIVE_TEMPLATE = '.*'/export const ACTIVE_TEMPLATE = 'plant_general'/" $CONFIG_FILE
    echo -e "${GREEN}✓ Plantilla cambiada a: plant_general${NC}"
    echo -e "${YELLOW}  → Carrusel + Categorías lado a lado${NC}"
  elif [ "$template" == "blackdays" ]; then
    sed -i "s/export const ACTIVE_TEMPLATE = '.*'/export const ACTIVE_TEMPLATE = 'plant_blackdays'/" $CONFIG_FILE
    echo -e "${GREEN}✓ Plantilla cambiada a: plant_blackdays${NC}"
    echo -e "${YELLOW}  → Banner Black Days + Categorías debajo${NC}"
  else
    echo -e "${RED}✗ Plantilla inválida. Usa: general o blackdays${NC}"
    exit 1
  fi
}

# Función para mostrar plantilla actual
show_current() {
  local current=$(grep "export const ACTIVE_TEMPLATE" $CONFIG_FILE | sed "s/.*'\(.*\)'.*/\1/")
  echo -e "${BLUE}📌 Plantilla actual:${NC} ${GREEN}$current${NC}"
  echo ""
}

# Menú interactivo
if [ -z "$1" ]; then
  show_current
  echo "Selecciona una plantilla:"
  echo "  1) plant_general (Carrusel + Categorías)"
  echo "  2) plant_blackdays (Banner Black Days)"
  echo "  3) Mostrar plantilla actual"
  echo "  4) Salir"
  echo ""
  read -p "Opción (1-4): " option
  
  case $option in
    1)
      change_template "general"
      ;;
    2)
      change_template "blackdays"
      ;;
    3)
      show_current
      ;;
    4)
      echo "Saliendo..."
      exit 0
      ;;
    *)
      echo -e "${RED}✗ Opción inválida${NC}"
      exit 1
      ;;
  esac
else
  change_template "$1"
fi

echo ""
echo -e "${BLUE}═══════════════════════════════════════════════${NC}"
echo -e "${GREEN}✓ Cambio completado${NC}"
echo -e "${YELLOW}→ Recarga tu navegador para ver los cambios${NC}"
echo -e "${BLUE}═══════════════════════════════════════════════${NC}"

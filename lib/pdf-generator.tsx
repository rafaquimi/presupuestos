import React from "react";
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Image,
} from "@react-pdf/renderer";

const styles = StyleSheet.create({
  page: {
    padding: 40,
    fontSize: 12,
    fontFamily: "Helvetica",
  },
  header: {
    marginBottom: 30,
    borderBottomWidth: 2,
    borderBottomColor: "#2563eb",
    borderBottomStyle: "solid",
    paddingBottom: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#1e40af",
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 12,
    color: "#6b7280",
    marginBottom: 10,
  },
  total: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#2563eb",
    textAlign: "right",
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#1f2937",
    marginBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#e5e7eb",
    borderBottomStyle: "solid",
    paddingBottom: 5,
  },
  row: {
    flexDirection: "row",
    marginBottom: 5,
  },
  label: {
    fontSize: 10,
    color: "#6b7280",
    width: 100,
  },
  value: {
    fontSize: 10,
    color: "#1f2937",
    flex: 1,
  },
  producto: {
    marginBottom: 20,
    padding: 15,
    backgroundColor: "#f9fafb",
    borderRadius: 5,
    borderWidth: 1,
    borderColor: "#e5e7eb",
    borderStyle: "solid",
  },
  productoHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  productoNombre: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#1f2937",
    flex: 1,
  },
  productoPrecio: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#2563eb",
  },
  productoDescripcion: {
    fontSize: 10,
    color: "#4b5563",
    marginBottom: 8,
  },
  caracteristicasTitle: {
    fontSize: 10,
    fontWeight: "bold",
    color: "#374151",
    marginBottom: 5,
  },
  caracteristica: {
    fontSize: 9,
    color: "#4b5563",
    marginLeft: 10,
    marginBottom: 3,
  },
  productoFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: "#d1d5db",
    borderTopStyle: "solid",
  },
  cantidad: {
    fontSize: 10,
    color: "#6b7280",
  },
  subtotal: {
    fontSize: 12,
    fontWeight: "bold",
    color: "#1f2937",
  },
  totalSection: {
    marginTop: 20,
    padding: 15,
    backgroundColor: "#eff6ff",
    borderRadius: 5,
  },
  totalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  totalLabel: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#1e40af",
  },
  totalValue: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#2563eb",
  },
  notas: {
    fontSize: 10,
    color: "#4b5563",
    marginTop: 10,
    padding: 10,
    backgroundColor: "#fef3c7",
    borderRadius: 5,
  },
  footer: {
    position: "absolute",
    bottom: 30,
    left: 40,
    right: 40,
    fontSize: 9,
    color: "#9ca3af",
    textAlign: "center",
    borderTopWidth: 1,
    borderTopColor: "#e5e7eb",
    borderTopStyle: "solid",
    paddingTop: 10,
  },
  productoImage: {
    width: 120,
    height: 120,
    objectFit: "contain",
    marginBottom: 10,
    borderRadius: 5,
  },
});

interface PresupuestoPDFProps {
  presupuesto: {
    numero: string;
    total: number;
    notas: string | null;
    createdAt: Date;
    cliente: {
      nombre: string;
      email: string;
      telefono: string | null;
      empresa: string | null;
    };
    productos: Array<{
      nombre: string;
      descripcion: string;
      caracteristicas: string;
      precio: number;
      cantidad: number;
      imagenUrl: string | null;
    }>;
  };
}

export function PresupuestoPDF({ presupuesto }: PresupuestoPDFProps) {
  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString("es-ES", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const companyName = process.env.NEXT_PUBLIC_COMPANY_NAME || "Tu Tienda de Informática";

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Header con Logo */}
        <View style={styles.header}>
          <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
            {/* Nombre de empresa */}
            <View>
              <Text style={{ fontSize: 18, fontWeight: "bold", color: "#1e40af", marginBottom: 2 }}>
                {companyName}
              </Text>
              <Text style={styles.subtitle}>Presupuesto #{presupuesto.numero}</Text>
              <Text style={styles.subtitle}>{formatDate(presupuesto.createdAt)}</Text>
            </View>
            {/* Total a la derecha */}
            <View>
              <Text style={{ fontSize: 10, color: "#6b7280", textAlign: "right" }}>
                Total
              </Text>
              <Text style={styles.total}>€{presupuesto.total.toFixed(2)}</Text>
            </View>
          </View>
          <Text style={[styles.title, { marginTop: 10 }]}>Presupuesto #{presupuesto.numero}</Text>
        </View>

        {/* Información del Cliente */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Información del Cliente</Text>
          <View style={styles.row}>
            <Text style={styles.label}>Nombre:</Text>
            <Text style={styles.value}>{presupuesto.cliente.nombre}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Email:</Text>
            <Text style={styles.value}>{presupuesto.cliente.email}</Text>
          </View>
          {presupuesto.cliente.telefono && (
            <View style={styles.row}>
              <Text style={styles.label}>Teléfono:</Text>
              <Text style={styles.value}>{presupuesto.cliente.telefono}</Text>
            </View>
          )}
          {presupuesto.cliente.empresa && (
            <View style={styles.row}>
              <Text style={styles.label}>Empresa:</Text>
              <Text style={styles.value}>{presupuesto.cliente.empresa}</Text>
            </View>
          )}
        </View>

        {/* Productos */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Productos</Text>
          {presupuesto.productos.map((producto, index) => (
            <View key={index} style={styles.producto}>
              {producto.imagenUrl && (
                <Image
                  src={producto.imagenUrl}
                  style={styles.productoImage}
                />
              )}
              <View style={styles.productoHeader}>
                <Text style={styles.productoNombre}>
                  {index + 1}. {producto.nombre}
                </Text>
                <Text style={styles.productoPrecio}>
                  €{producto.precio.toFixed(2)}
                </Text>
              </View>

              {producto.descripcion && (
                <Text style={styles.productoDescripcion}>
                  {producto.descripcion}
                </Text>
              )}

              {producto.caracteristicas && (
                <View>
                  <Text style={styles.caracteristicasTitle}>Características:</Text>
                  {producto.caracteristicas
                    .split("\n")
                    .filter((c) => c.trim())
                    .map((caracteristica, idx) => (
                      <Text key={idx} style={styles.caracteristica}>
                        • {caracteristica.trim()}
                      </Text>
                    ))}
                </View>
              )}

              <View style={styles.productoFooter}>
                <Text style={styles.cantidad}>
                  Cantidad: {producto.cantidad} x €{producto.precio.toFixed(2)}
                </Text>
                <Text style={styles.subtotal}>
                  €{(producto.precio * producto.cantidad).toFixed(2)}
                </Text>
              </View>
            </View>
          ))}
        </View>

        {/* Notas */}
        {presupuesto.notas && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Notas Adicionales</Text>
            <Text style={styles.notas}>{presupuesto.notas}</Text>
          </View>
        )}

        {/* Total */}
        <View style={styles.totalSection}>
          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>Total del Presupuesto</Text>
            <Text style={styles.totalValue}>€{presupuesto.total.toFixed(2)}</Text>
          </View>
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={{ fontWeight: "bold", marginBottom: 5 }}>{companyName}</Text>
          <Text>Este presupuesto es válido por 30 días desde la fecha de emisión.</Text>
          <Text>Para cualquier consulta, no dude en contactarnos.</Text>
        </View>
      </Page>
    </Document>
  );
}


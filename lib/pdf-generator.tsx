/* eslint-disable jsx-a11y/alt-text */
import { Document, Image, Page, StyleSheet, Text, View } from "@react-pdf/renderer";

type PdfProducto = {
  nombre: string;
  descripcion: string;
  caracteristicas: string;
  precio: number;
  cantidad: number;
  imagenUrl?: string | null;
};

export type PdfPresupuesto = {
  numero: string;
  clienteNombre: string;
  clienteEmail: string;
  clienteTelefono?: string | null;
  clienteEmpresa?: string | null;
  notas?: string | null;
  subtotal: number;
  ivaPorcentaje: number;
  iva: number;
  total: number;
  createdAt: Date | string;
  productos: PdfProducto[];
};

export type PdfConfiguracion = {
  empresaNombre: string;
  nif?: string | null;
  direccion?: string | null;
  telefono?: string | null;
  email?: string | null;
  validezDias: number;
};

const styles = StyleSheet.create({
  page: { padding: 40, fontSize: 10, fontFamily: "Helvetica", color: "#172033" },
  header: { flexDirection: "row", justifyContent: "space-between", marginBottom: 28 },
  title: { fontSize: 22, fontWeight: 700, color: "#1d4ed8" },
  subtitle: { marginTop: 5, color: "#64748b" },
  right: { textAlign: "right" },
  section: { marginBottom: 18 },
  sectionTitle: { fontSize: 11, fontWeight: 700, marginBottom: 7, color: "#334155" },
  box: { border: "1 solid #dbe3ef", borderRadius: 5, padding: 10 },
  product: { borderBottom: "1 solid #e2e8f0", paddingVertical: 9 },
  productLast: { paddingTop: 9 },
  productContent: { flexDirection: "row", gap: 10 },
  productImage: { width: 48, height: 48, objectFit: "cover", borderRadius: 4 },
  productText: { flexGrow: 1, flexBasis: 0 },
  row: { flexDirection: "row", justifyContent: "space-between", gap: 12 },
  productName: { fontSize: 11, fontWeight: 700, flexGrow: 1 },
  muted: { color: "#64748b", marginTop: 3, lineHeight: 1.4 },
  totals: { marginLeft: "auto", width: 230, marginTop: 18 },
  totalRow: { flexDirection: "row", justifyContent: "space-between", paddingVertical: 4 },
  grandTotal: { flexDirection: "row", justifyContent: "space-between", paddingTop: 8, marginTop: 5, borderTop: "1 solid #94a3b8", fontSize: 14, fontWeight: 700, color: "#1d4ed8" },
  footer: { position: "absolute", left: 40, right: 40, bottom: 28, textAlign: "center", color: "#94a3b8", fontSize: 8 },
});

const money = (value: number) => `${value.toFixed(2)} EUR`;

export function PresupuestoPDF({ presupuesto, configuracion }: { presupuesto: PdfPresupuesto; configuracion: PdfConfiguracion }) {
  const date = new Date(presupuesto.createdAt).toLocaleDateString("es-ES");
  return (
    <Document title={`Presupuesto ${presupuesto.numero}`} author={configuracion.empresaNombre}>
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          <View>
            <Text style={styles.title}>{configuracion.empresaNombre}</Text>
            {configuracion.nif && <Text style={styles.subtitle}>NIF: {configuracion.nif}</Text>}
            {configuracion.direccion && <Text style={styles.subtitle}>{configuracion.direccion}</Text>}
            {configuracion.telefono && <Text style={styles.subtitle}>{configuracion.telefono}</Text>}
            {configuracion.email && <Text style={styles.subtitle}>{configuracion.email}</Text>}
          </View>
          <View style={styles.right}>
            <Text style={{ fontSize: 16, fontWeight: 700 }}>PRESUPUESTO</Text>
            <Text style={styles.subtitle}>{presupuesto.numero}</Text>
            <Text style={styles.subtitle}>{date}</Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>CLIENTE</Text>
          <View style={styles.box}>
            <Text>{presupuesto.clienteNombre}</Text>
            {presupuesto.clienteEmpresa && <Text style={styles.muted}>{presupuesto.clienteEmpresa}</Text>}
            <Text style={styles.muted}>{presupuesto.clienteEmail}</Text>
            {presupuesto.clienteTelefono && <Text style={styles.muted}>{presupuesto.clienteTelefono}</Text>}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>DETALLE</Text>
          <View style={styles.box}>
            {presupuesto.productos.map((producto, index) => (
              <View key={`${producto.nombre}-${index}`} style={index === presupuesto.productos.length - 1 ? styles.productLast : styles.product} wrap={false}>
                <View style={styles.productContent}>
                  {producto.imagenUrl && <Image src={producto.imagenUrl} style={styles.productImage} />}
                  <View style={styles.productText}>
                    <View style={styles.row}>
                      <Text style={styles.productName}>{producto.nombre}</Text>
                      <Text>{producto.cantidad} x {money(producto.precio)}</Text>
                      <Text>{money(producto.cantidad * producto.precio)}</Text>
                    </View>
                    {producto.descripcion && <Text style={styles.muted}>{producto.descripcion}</Text>}
                    {producto.caracteristicas && <Text style={styles.muted}>{producto.caracteristicas}</Text>}
                  </View>
                </View>
              </View>
            ))}
          </View>
        </View>

        {presupuesto.notas && (
          <View style={styles.section} wrap={false}>
            <Text style={styles.sectionTitle}>NOTAS</Text>
            <View style={styles.box}><Text>{presupuesto.notas}</Text></View>
          </View>
        )}

        <View style={styles.totals} wrap={false}>
          <View style={styles.totalRow}><Text>Subtotal</Text><Text>{money(presupuesto.subtotal)}</Text></View>
          <View style={styles.totalRow}><Text>IVA ({presupuesto.ivaPorcentaje.toFixed(2)}%)</Text><Text>{money(presupuesto.iva)}</Text></View>
          <View style={styles.grandTotal}><Text>Total</Text><Text>{money(presupuesto.total)}</Text></View>
        </View>

        <Text style={styles.footer} fixed>
          Presupuesto válido durante {configuracion.validezDias} días desde su fecha de emisión.
        </Text>
      </Page>
    </Document>
  );
}

// Filename: components/Footer.tsx

export default function Footer() {
    return (
        <footer className="w-full text-center p-8 mt-16 border-t">
            <p className="text-sm text-muted-foreground">
                © {new Date().getFullYear()} Plant Analyzer. Dibuat sebagai Proyek Akhir.
            </p>
        </footer>
    );
}
import sys
import io
import os
import shutil
import threading
from datetime import datetime
import customtkinter as ctk
from tkinter import filedialog as fd

import generate_requirements
from pdf_parser import scan_and_parse_all, extract_text_from_pdf, identify_project

# Set appearance and theme
ctk.set_appearance_mode("Dark")  # Modes: "System" (standard), "Dark", "Light"
ctk.set_default_color_theme("blue")  # Themes: "blue" (standard), "green", "dark-blue"

BASE_PATH = os.path.dirname(os.path.abspath(__file__))

class KNCCAutomationApp(ctk.CTk):
    def __init__(self):
        super().__init__()

        self.title("KNCC Material Automation Platform")
        self.geometry("1100x700")
        
        # Grid Layout
        self.grid_columnconfigure(1, weight=1)
        self.grid_columnconfigure(2, weight=1)
        self.grid_rowconfigure(0, weight=1)

        # --- Sidebar ---
        self.sidebar_frame = ctk.CTkFrame(self, width=200, corner_radius=0)
        self.sidebar_frame.grid(row=0, column=0, rowspan=4, sticky="nsew")
        self.sidebar_frame.grid_rowconfigure(4, weight=1)

        self.logo_label = ctk.CTkLabel(self.sidebar_frame, text="KNCC Automator", font=ctk.CTkFont(size=24, weight="bold"))
        self.logo_label.grid(row=0, column=0, padx=20, pady=(20, 10))

        self.btn_dashboard = ctk.CTkButton(self.sidebar_frame, text="Dashboard", command=self.show_dashboard)
        self.btn_dashboard.grid(row=1, column=0, padx=20, pady=10)

        self.btn_reconcile = ctk.CTkButton(self.sidebar_frame, text="Reconciliation", command=self.show_reconciliation)
        self.btn_reconcile.grid(row=2, column=0, padx=20, pady=10)
        
        self.appearance_mode_label = ctk.CTkLabel(self.sidebar_frame, text="Appearance Mode:", anchor="w")
        self.appearance_mode_label.grid(row=5, column=0, padx=20, pady=(10, 0))
        self.appearance_mode_optionemenu = ctk.CTkOptionMenu(self.sidebar_frame, values=["Dark", "Light", "System"],
                                                                       command=self.change_appearance_mode_event)
        self.appearance_mode_optionemenu.grid(row=6, column=0, padx=20, pady=(10, 20))

        # --- Main View: Dashboard ---
        self.dashboard_frame = ctk.CTkFrame(self, corner_radius=15, fg_color="transparent")
        self.dashboard_frame.grid(row=0, column=1, columnspan=2, padx=20, pady=20, sticky="nsew")
        self.dashboard_frame.grid_columnconfigure(0, weight=1)
        self.dashboard_frame.grid_columnconfigure(1, weight=1)
        self.dashboard_frame.grid_rowconfigure(2, weight=1)

        self.title_label = ctk.CTkLabel(self.dashboard_frame, text="System Status Overview", font=ctk.CTkFont(size=28, weight="bold"))
        self.title_label.grid(row=0, column=0, columnspan=2, padx=20, pady=(10, 20), sticky="w")

        # Stats widgets
        self.stats_frame = ctk.CTkFrame(self.dashboard_frame)
        self.stats_frame.grid(row=1, column=0, columnspan=2, sticky="nsew", pady=10)
        self.stats_frame.grid_columnconfigure((0, 1, 2), weight=1)

        self.inv_stat = self.create_stat_card(self.stats_frame, "Invoices Found", "Scanning...", 0, 0)
        self.co_stat = self.create_stat_card(self.stats_frame, "Change Orders", "Scanning...", 0, 1)
        self.po_stat = self.create_stat_card(self.stats_frame, "Purchase Orders", "Scanning...", 0, 2)

        # Action Area
        self.action_frame = ctk.CTkFrame(self.dashboard_frame)
        self.action_frame.grid(row=2, column=0, columnspan=2, sticky="nsew", pady=20)
        self.action_frame.grid_rowconfigure(2, weight=1)
        self.action_frame.grid_columnconfigure((0, 1), weight=1)

        self.upload_btn = ctk.CTkButton(self.action_frame, text="📁 UPLOAD PDFS MANUALLY", 
                                     font=ctk.CTkFont(size=16, weight="bold"), height=50, 
                                     fg_color="#1f6aa5", hover_color="#144870",
                                     command=self.upload_files)
        self.upload_btn.grid(row=0, column=0, pady=(20, 10), padx=20, sticky="ew")

        self.run_btn = ctk.CTkButton(self.action_frame, text="▶ RUN AUTOMATION PIPELINE", 
                                     font=ctk.CTkFont(size=16, weight="bold"), height=50, 
                                     fg_color="#28a745", hover_color="#218838",
                                     command=self.start_automation)
        self.run_btn.grid(row=0, column=1, pady=(20, 10), padx=20, sticky="ew")

        self.log_textbox = ctk.CTkTextbox(self.action_frame, font=ctk.CTkFont(family="Consolas", size=12))
        self.log_textbox.grid(row=1, column=0, columnspan=2, padx=20, pady=10, sticky="nsew")
        self.log_textbox.insert("0.0", "System idle. Ready to start.\n")
        self.log_textbox.configure(state="disabled")

        # --- Reconciliation View ---
        self.recon_frame = ctk.CTkFrame(self, corner_radius=15, fg_color="transparent")
        self.recon_frame.grid_columnconfigure(0, weight=1)
        self.recon_frame.grid_rowconfigure(1, weight=1)

        self.recon_title = ctk.CTkLabel(self.recon_frame, text="Reconciliation & Error Report", font=ctk.CTkFont(size=28, weight="bold"))
        self.recon_title.grid(row=0, column=0, padx=20, pady=(10, 20), sticky="w")
        
        self.recon_textbox = ctk.CTkTextbox(self.recon_frame, font=ctk.CTkFont(family="Consolas", size=13))
        self.recon_textbox.grid(row=1, column=0, padx=20, pady=10, sticky="nsew")
        self.recon_textbox.insert("0.0", "Run the automation first to see the reconciliation report comparing the PDFs to the Excel file.\n")
        self.recon_textbox.configure(state="disabled")

        # Start background scan
        threading.Thread(target=self.scan_files, daemon=True).start()

    def create_stat_card(self, parent, title, value, row, col):
        frame = ctk.CTkFrame(parent, corner_radius=10, fg_color=("gray85", "gray20"))
        frame.grid(row=row, column=col, padx=10, pady=10, sticky="nsew")
        
        lbl_title = ctk.CTkLabel(frame, text=title, font=ctk.CTkFont(size=14))
        lbl_title.pack(pady=(10, 0))
        
        lbl_val = ctk.CTkLabel(frame, text=value, font=ctk.CTkFont(size=32, weight="bold"), text_color="#1f6aa5")
        lbl_val.pack(pady=(5, 10))
        return lbl_val

    def change_appearance_mode_event(self, new_appearance_mode: str):
        ctk.set_appearance_mode(new_appearance_mode)

    def show_dashboard(self):
        self.recon_frame.grid_forget()
        self.dashboard_frame.grid(row=0, column=1, columnspan=2, padx=20, pady=20, sticky="nsew")

    def show_reconciliation(self):
        self.dashboard_frame.grid_forget()
        self.recon_frame.grid(row=0, column=1, columnspan=2, padx=20, pady=20, sticky="nsew")

    def scan_files(self):
        try:
            data = scan_and_parse_all(BASE_PATH)
            self.inv_stat.configure(text=str(len(data["invoices"])))
            self.co_stat.configure(text=str(len(data["change_orders"])))
            self.po_stat.configure(text=str(len(data["purchase_orders"])))
        except Exception as e:
            self.inv_stat.configure(text="Error")

    def write_log(self, text):
        self.log_textbox.configure(state="normal")
        self.log_textbox.insert("end", text)
        self.log_textbox.see("end")
        self.log_textbox.configure(state="disabled")

    def set_recon_text(self, text):
        self.recon_textbox.configure(state="normal")
        self.recon_textbox.delete("0.0", "end")
        self.recon_textbox.insert("0.0", text)
        self.recon_textbox.configure(state="disabled")

    def start_automation(self):
        self.run_btn.configure(state="disabled", text="RUNNING...")
        self.upload_btn.configure(state="disabled")
        self.log_textbox.configure(state="normal")
        self.log_textbox.delete("0.0", "end")
        self.log_textbox.configure(state="disabled")
        
        threading.Thread(target=self._run_automation_thread, daemon=True).start()

    def upload_files(self):
        filetypes = (('PDF files', '*.pdf'), ('All files', '*.*'))
        filenames = fd.askopenfilenames(title='Select Invoices or POs', initialdir='/', filetypes=filetypes)
        
        if not filenames:
            return
            
        upload_dir = os.path.join(BASE_PATH, "Uploads")
        os.makedirs(upload_dir, exist_ok=True)
        
        self.write_log(f"Copying {len(filenames)} files to Uploads directory...\n")
        
        for f in filenames:
            try:
                dest = os.path.join(upload_dir, os.path.basename(f))
                shutil.copy2(f, dest)
                self.write_log(f"  + {os.path.basename(f)}\n")
            except Exception as e:
                self.write_log(f"  ❌ Error copying {os.path.basename(f)}: {e}\n")
                
        self.write_log("Upload complete. Ready to run automation.\n")
        # Update stats
        threading.Thread(target=self.scan_files, daemon=True).start()

    def _route_uploaded_files(self):
        upload_dir = os.path.join(BASE_PATH, "Uploads")
        if not os.path.exists(upload_dir):
            return 0
            
        uploaded_files = [os.path.join(upload_dir, f) for f in os.listdir(upload_dir) if f.endswith(".pdf")]
        moved_count = 0
        
        for filepath in uploaded_files:
            try:
                text = extract_text_from_pdf(filepath)
                project = identify_project(text)
                is_co = "CHANGE ORDER" in text.upper()
                
                dest_dir = ""
                if project == "Cobia Cove":
                    dest_dir = os.path.join(BASE_PATH, "Client", "Cobia Cove", "Cobia Cove Change Orders" if is_co else r"Invoices (3)\Invoices")
                elif project == "Willow Way":
                    dest_dir = os.path.join(BASE_PATH, "Client", "Willow way Village", "Willow Way Village CO's" if is_co else "Invoices")
                
                if dest_dir and os.path.exists(dest_dir):
                    shutil.move(filepath, os.path.join(dest_dir, os.path.basename(filepath)))
                    moved_count += 1
            except Exception as e:
                print(f"Error routing {filepath}: {e}")
                
        return moved_count

    def _run_automation_thread(self):
        # Capture stdout
        old_stdout = sys.stdout
        new_stdout = io.StringIO()
        sys.stdout = new_stdout

        try:
            # First, route any manually uploaded files
            moved = self._route_uploaded_files()
            if moved > 0:
                print(f"Automatically routed {moved} uploaded PDFs to their correct project folders.\n")
                
            generate_requirements.main()
            output = new_stdout.getvalue()
            self.write_log(output)
            self.generate_reconciliation_report(output)
            self.write_log("\n✅ SUCCESSFULLY FINISHED!")
        except Exception as e:
            self.write_log(f"\n❌ ERROR: {str(e)}")
        finally:
            sys.stdout = old_stdout
            # Update UI from main thread safely
            self.after(0, lambda: self.run_btn.configure(state="normal", text="▶ RUN AUTOMATION PIPELINE"))
            self.after(0, lambda: self.upload_btn.configure(state="normal"))

    def generate_reconciliation_report(self, log_output):
        report = "KNCC RECONCILIATION & ERROR REPORT\n"
        report += "=" * 60 + "\n\n"
        
        report += "The system compared the extracted PDF data against the rows in your Client_Requirments_Doc.xlsx.\n"
        report += "The following items were found in PDFs but had NO MATCH in the Excel spreadsheet.\n"
        report += "Please verify if these should be ignored (like STORAGE fees) or if a new row needs to be created in Excel.\n\n"
        
        cobia = []
        willow = []
        
        curr_proj = ""
        for line in log_output.split("\n"):
            if "Processing sheet: Cobia Cove" in line:
                curr_proj = "Cobia Cove"
            elif "Processing sheet: Willow Way" in line:
                curr_proj = "Willow Way"
                
            if "Invoice" in line and ":" in line and curr_proj:
                if "matched" not in line.lower() and "unmatched" not in line.lower():
                    if curr_proj == "Cobia Cove":
                        cobia.append(line.strip())
                    else:
                        willow.append(line.strip())

        report += "--- COBIA COVE APARTMENTS (Unmatched Items) ---\n"
        if not cobia:
            report += "  ✅ All material invoices successfully matched to Excel rows.\n"
        else:
            for item in cobia:
                report += f"  ⚠ {item}\n"
                
        report += "\n--- WILLOW WAY APARTMENTS (Unmatched Items) ---\n"
        if not willow:
            report += "  ✅ All material invoices successfully matched to Excel rows.\n"
        else:
            for item in willow:
                report += f"  ⚠ {item}\n"
                
        report += "\n\n" + "=" * 60 + "\n"
        report += "Note: Non-material items like 'HARDWARE PACKAGE', 'STORAGE', or 'TRUSS PACKAGE' \n"
        report += "are intentionally not matched to lumber material rows. This is normal and correct."
        
        self.after(0, lambda: self.set_recon_text(report))


if __name__ == "__main__":
    app = KNCCAutomationApp()
    app.mainloop()

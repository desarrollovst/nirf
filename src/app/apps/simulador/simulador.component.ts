import { Component, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';

@Component({
  templateUrl: './simulador.component.html',
  styleUrls: ['./simulador.component.scss']
})
export class SimuladorComponent implements OnInit {
  creditoForm!: UntypedFormGroup;

  // Límites del crédito
  montoMinimo = 5000;
  montoMaximo = 100000;
  incrementoMonto = 500;

  // Resultado de la simulación
  pagoPeriodico = 0;
  numeroPagos = 0;
  intereses = 0;
  totalPagar = 0;

  constructor(private fb: UntypedFormBuilder){ 
  }

  ngOnInit(): void {
    this.creditoForm = this.fb.group({
      monto: [5000,
        [
          Validators.required,
          Validators.min(this.montoMinimo),
          Validators.max(this.montoMaximo)
        ]
      ],
      periodicidad: [
        'quincenal',
        Validators.required
      ],
      plazo: [
        12,
        [
          Validators.required,
          Validators.min(1)
        ]
      ],
      tasa: [
        42,
        [
          Validators.required,
          Validators.min(0),
          Validators.max(100)
        ]
      ]
    });

    this.creditoForm.valueChanges.subscribe(() => {
      this.calcularCredito();
    });

    this.calcularCredito();
  }

  calcularCredito(): void {
    const monto = Number(this.creditoForm.get('monto')?.value);
    const plazo = Number(this.creditoForm.get('plazo')?.value);
    const tasaAnual = Number(this.creditoForm.get('tasa')?.value);
    const periodicidad = this.creditoForm.get('periodicidad')?.value;

    if (!monto || !plazo || tasaAnual === null || tasaAnual === undefined) {
      return;
    }

    /*
     * Convertimos la tasa anual a la periodicidad
     */
    let tasaPeriodo: number;

    if (periodicidad === 'quincenal') {
      tasaPeriodo = tasaAnual / 24 / 100;
    } else {
      tasaPeriodo = tasaAnual / 12 / 100;
    }

    this.numeroPagos = plazo;

    /*
     * Fórmula de pago fijo:
     *
     * P = C * [ i(1+i)^n ] / [ (1+i)^n - 1 ]
     */

    if (tasaPeriodo === 0) {
      this.pagoPeriodico = monto / plazo;
    } else {
      this.pagoPeriodico =
        monto * (tasaPeriodo * Math.pow(1 + tasaPeriodo, plazo)) / (Math.pow(1 + tasaPeriodo, plazo) - 1);
    }
    this.totalPagar = this.pagoPeriodico * this.numeroPagos;
    this.intereses = this.totalPagar - monto;
  }

  cambiarPeriodicidad(periodicidad: string): void {
    this.creditoForm.patchValue({
      periodicidad: periodicidad
    });

    this.calcularCredito();
  }

  formatearMoneda(valor: number): string {
    return valor.toLocaleString('es-MX', {
      style: 'currency',
      currency: 'MXN'
    });
  }
}
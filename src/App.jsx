import React, { useState } from 'react';
import './App.css';

// Importar la función de validación de RUT
const validarYFormatearRut = (rutCompleto) => {
  if (!rutCompleto) return { valido: false, formateado: '', error: '' };

  rutCompleto = rutCompleto.replace(/\./g, '').replace(/-/g, '').toUpperCase();
  let cuerpo = rutCompleto.slice(0, -1);
  let dv = rutCompleto.slice(-1);

  if (!/^\d+$/.test(cuerpo) || !/^[\dkK]$/.test(dv)) {
    return { valido: false, formateado: rutCompleto, error: 'Formato inválido' };
  }

  let suma = 0;
  let multiplo = 2;
  for (let i = cuerpo.length - 1; i >= 0; i--) {
    suma += parseInt(cuerpo.charAt(i), 10) * multiplo;
    multiplo = multiplo === 7 ? 2 : multiplo + 1;
  }
  const dvEsperado = 11 - (suma % 11);
  const dvCalculado = dvEsperado === 11 ? '0' : dvEsperado === 10 ? 'K' : dvEsperado.toString();

  const esValido = dv === dvCalculado;
  let rutFormateado = cuerpo.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  rutFormateado += '-' + dv;

  return {
    valido: esValido,
    formateado: rutFormateado,
    error: esValido ? '' : 'RUT inválido'
  };
};

// Componente FormField
function FormField({ label, id, type = 'text', value, onChange, required = false, rows, error = '' }) {
  const InputComponent = type === 'textarea' ? 'textarea' : 'input';
  const errorClass = error ? 'border-red-500' : 'border-gray-300';

  return (
    <div className="mb-4">
      <label htmlFor={id} className="block text-sm font-medium text-gray-700 mb-1">
        {label}{required && <span className="text-red-500">*</span>}
      </label>
      <InputComponent
        type={type}
        id={id}
        name={id}
        value={value}
        onChange={onChange}
        required={required}
        rows={rows}
        className={`mt-1 block w-full px-3 py-2 bg-white border rounded-md shadow-sm focus:outline-none sm:text-sm ${errorClass}`}
        aria-invalid={!!error}
        aria-describedby={error ? `${id}-error` : undefined}
      />
      {error && <p id={`${id}-error`} className="mt-1 text-xs text-red-600">{error}</p>}
    </div>
  );
}

// Componente principal App
function App() {
  const [patientData, setPatientData] = useState({
    nombre: '',
    rut: '',
    oda: '',
    direccion: '',
    telefono: '',
    edad: '',
    diagnostico: '',
    antecedentes: '',
    examenes: '',
    evaluacionInicial: '',
    evaluacionFinal: '',
    prestaciones: [{ fecha: '', detalle: '' }]
  });

  const [rutDisplay, setRutDisplay] = useState('');
  const [rutError, setRutError] = useState('');

  const handleRutChange = (e) => {
    const valorInput = e.target.value;
    setRutDisplay(valorInput);

    const { valido, formateado, error } = validarYFormatearRut(valorInput);

    if (valorInput === '' || /^[0-9kK.-]*$/.test(valorInput)) {
      const rutLimpio = valorInput.replace(/[.-]/g, '').toUpperCase();
      setPatientData(prevData => ({
        ...prevData,
        rut: rutLimpio
      }));
    }
    setRutError(error);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'rut') return;

    setPatientData(prevData => ({
      ...prevData,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Datos del paciente:', patientData);
  };

  return (
    <div className="min-h-screen bg-gray-100 py-6 flex flex-col justify-center sm:py-12">
      <div className="relative py-3 sm:max-w-xl md:max-w-4xl mx-auto">
        <div className="relative px-4 py-10 bg-white shadow-lg sm:rounded-3xl sm:p-20">
          <div className="max-w-4xl mx-auto">
            <div className="divide-y divide-gray-200">
              <div className="py-8 text-base leading-6 space-y-4 text-gray-700 sm:text-lg sm:leading-7">
                <h1 className="text-3xl font-bold text-center mb-8 text-gray-900">
                  Ficha Kinesiológica Digital
                </h1>
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Aquí va todo el contenido del formulario */}
                  {/* Sección de datos personales */}
                  <section className="space-y-4">
                    <h2 className="text-xl font-semibold">Datos Personales</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField
                        label="Nombre Completo"
                        id="nombre"
                        value={patientData.nombre}
                        onChange={handleChange}
                        required
                      />
                      <FormField
                        label="RUT"
                        id="rut"
                        value={rutDisplay}
                        onChange={handleRutChange}
                        required
                        error={rutError}
                      />
                    </div>
                  </section>

                  <button
                    type="submit"
                    className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    Guardar Ficha
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;

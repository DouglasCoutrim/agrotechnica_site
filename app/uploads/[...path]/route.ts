import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import mime from 'mime-types';

interface UploadParams {
  path: string[];
}

export async function GET(
  request: NextRequest,
  { params }: { params: UploadParams }
) {
  const uploadDir = process.env.UPLOAD_DIR;
  
  // Validações básicas
  if (!uploadDir) {
    return NextResponse.json(
      { error: 'Upload directory not configured' },
      { status: 500 }
    );
  }

  const { path: pathSegments } = params;
  
  if (!pathSegments || pathSegments.length === 0) {
    return new Response('Invalid path', { status: 400 });
  }

  // Construir caminho relativo
  const relativePath = path.join(...pathSegments);

  // Validar segurança do caminho
  const normalizedPath = path.normalize(relativePath);
  
  if (normalizedPath.includes('..') || 
      path.isAbsolute(normalizedPath) ||
      normalizedPath.startsWith('..')) {
    return new Response('Invalid path', { status: 400 });
  }

  // Construir caminho absoluto
  const absolutePath = path.join(uploadDir, normalizedPath);

  // Verificar se o caminho está dentro do diretório permitido
  const resolvedUploadDir = path.resolve(uploadDir);
  const resolvedAbsolutePath = path.resolve(absolutePath);

  if (!resolvedAbsolutePath.startsWith(resolvedUploadDir)) {
    return new Response('Invalid path', { status: 400 });
  }

  try {
    // Verificar se o arquivo existe
    await fs.promises.access(absolutePath, fs.constants.R_OK);
    
    // Obter stats para cabeçalhos de cache
    const stat = await fs.promises.stat(absolutePath);
    const fileSize = stat.size;
    
    // Determinar tipo MIME
    const contentType = mime.lookup(absolutePath) || 'application/octet-stream';
    
    // Criar stream do arquivo
    const fileStream = fs.createReadStream(absolutePath);
    
    // Preparar resposta com cabeçalhos de cache
    const responseHeaders = new Headers({
      'Content-Type': contentType,
      'Content-Length': fileSize.toString(),
      'Cache-Control': 'public, max-age=31536000, immutable' // Cache de 1 ano
    });
    
    return new Response(fileStream as any, {
      status: 200,
      headers: responseHeaders
    });
    
  } catch (error) {
    const err = error as NodeJS.ErrnoException;
    
    if (err.code === 'ENOENT') {
      return new Response('File not found', { status: 404 });
    } else {
      console.error('File read error:', error);
      return new Response('Server error', { status: 500 });
    }
  }
}
